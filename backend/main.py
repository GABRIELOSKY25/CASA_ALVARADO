from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Producto, Calificacion, Gamma, Marca, Categoria, Tipo  # Agrega Marca, Categoria, Tipo
from sqlalchemy import func
from typing import Optional, List
from pydantic import BaseModel


# Agrega estos modelos Pydantic para respuestas (después de los imports)
class ProductoResponse(BaseModel):
    modelo: str
    imagen: str
    descripcion: str
    estrellas: int
    categoria: str
    marca: str
    sub_categoria: str
    tipo: str
    gamma: str

class MarcaResponse(BaseModel):
    id_marca: int
    nombre: str
    imagen: Optional[str] = None


app = FastAPI()

# ACTIVAR CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def inicio():
    return {"mensaje": "Conectado a Casa Alvarado API"}

@app.get("/producto/{modelo}")
def obtener_producto(modelo: str):
    db = SessionLocal()
    try:
        producto = db.query(Producto).filter(
            Producto.modelo == modelo
        ).first()

        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        promedio = db.query(func.avg(Calificacion.estrellas)).filter(
            Calificacion.modelo == modelo
        ).scalar()

        return {
            "modelo": producto.modelo,
            "imagen": producto.imagen,
            "descripcion": producto.descripcion,
            "estrellas": int(promedio or 0),

            "categoria": producto.categoria.nombre,
            "marca": producto.marca.nombre,
            "sub_categoria": producto.sub_categoria.nombre,
            "tipo": producto.tipo.nombre,
            "gamma": producto.gamma.nombre
        }

    finally:
        db.close()
        
@app.get("/productos-similares/{modelo}")
def productos_similares(modelo: str):
    db = SessionLocal()

    try:
        producto_actual = db.query(Producto).filter(
            Producto.modelo == modelo
        ).first()

        if not producto_actual:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        similares = (
            db.query(
                Producto,
                func.avg(Calificacion.estrellas).label("promedio")
            )
            .outerjoin(
                Calificacion,
                Producto.modelo == Calificacion.modelo
            )
            .filter(
                Producto.id_categoria == producto_actual.id_categoria,
                Producto.modelo != modelo
            )
            .group_by(Producto.modelo)
            .order_by(func.avg(Calificacion.estrellas).desc())
            .limit(3)
            .all()
        )

        resultado = []

        for producto, promedio in similares:
            resultado.append({
                "modelo": producto.modelo,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
                "marca": producto.marca.nombre,
                "categoria": producto.categoria.nombre,
                "estrellas": round(promedio or 0, 1)
            })

        return resultado

    finally:
        db.close()

@app.get("/productos/todos", response_model=List[ProductoResponse])
def obtener_todos_productos():
    """Obtener todos los productos con sus calificaciones promedio"""
    db = SessionLocal()
    try:
        productos = db.query(Producto).all()
        resultado = []
        
        for producto in productos:
            promedio = db.query(func.avg(Calificacion.estrellas)).filter(
                Calificacion.modelo == producto.modelo
            ).scalar()
            
            resultado.append({
                "modelo": producto.modelo,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
                "estrellas": int(promedio or 0),
                "categoria": producto.categoria.nombre,
                "marca": producto.marca.nombre,
                "sub_categoria": producto.sub_categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })
        
        return resultado
    finally:
        db.close()

@app.get("/marcas/todas", response_model=List[MarcaResponse])
def obtener_todas_marcas():
    """Obtener todas las marcas para el carrusel"""
    db = SessionLocal()
    try:
        marcas = db.query(Marca).all()
        return [
            {
                "id_marca": m.id_marca,
                "nombre": m.nombre,
                "imagen": m.imagen
            }
            for m in marcas
        ]
    finally:
        db.close()

@app.get("/filtros/opciones")
def obtener_opciones_filtros():
    """Obtener todas las opciones de filtros disponibles"""
    db = SessionLocal()
    try:
        marcas = db.query(Marca.nombre).distinct().all()
        categorias = db.query(Categoria.nombre).distinct().all()
        tipos = db.query(Tipo.nombre).distinct().all()
        gamas = db.query(Gamma.nombre).distinct().all()
        
        return {
            "marcas": [m[0] for m in marcas],
            "categorias": [c[0] for c in categorias],
            "tipos": [t[0] for t in tipos],
            "gamas": [g[0] for g in gamas]
        }
    finally:
        db.close()

@app.get("/productos/buscar/{termino}")
def buscar_productos_por_modelo(termino: str):
    """Buscar productos por modelo (coincidencia parcial)"""
    db = SessionLocal()
    try:
        # Búsqueda que contiene el término (insensible a mayúsculas)
        productos = db.query(Producto).filter(
            Producto.modelo.like(f'%{termino}%')
        ).all()
        
        resultado = []
        for producto in productos:
            promedio = db.query(func.avg(Calificacion.estrellas)).filter(
                Calificacion.modelo == producto.modelo
            ).scalar()
            
            resultado.append({
                "modelo": producto.modelo,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
                "estrellas": int(promedio or 0),
                "categoria": producto.categoria.nombre,
                "marca": producto.marca.nombre,
                "sub_categoria": producto.sub_categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })
        
        return resultado
    finally:
        db.close()