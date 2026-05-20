from fastapi import APIRouter, HTTPException
from database import SessionLocal
from models import (
    Producto,
    Marca,
    Tipo,
    Gamma,
    Calificacion, 
    Categoria
)

from sqlalchemy import func
from pydantic import BaseModel
from typing import List


router = APIRouter()


# =========================
# MODELOS PYDANTIC
# =========================

class ProductoResponse(BaseModel):
    modelo: str
    imagen: str
    descripcion: str
    estrellas: int
    marca: str
    categoria: str
    tipo: str
    gamma: str


class ProductoCreate(BaseModel):
    modelo: str
    imagen: str
    descripcion: str
    novedad: str

    id_marca: int
    id_categoria: int
    id_tipo: int
    id_gamma: int


# =========================
# OBTENER TODOS LOS PRODUCTOS
# =========================

@router.get("/productos/todos", response_model=List[ProductoResponse])
def obtener_todos_productos():

    db = SessionLocal()

    try:

        productos = db.query(Producto).all()

        resultado = []

        for producto in productos:

            promedio = db.query(
                func.avg(Calificacion.estrellas)
            ).filter(
                Calificacion.modelo == producto.modelo
            ).scalar()

            resultado.append({
                "modelo": producto.modelo,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
                "estrellas": int(promedio or 0),
                "marca": producto.marca.nombre,
                "categoria": producto.marca.categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })

        return resultado

    finally:
        db.close()


# =========================
# BUSCAR PRODUCTO
# =========================

@router.get("/productos/buscar/{modelo}")
def buscar_producto(modelo: str):

    db = SessionLocal()

    try:

        productos = db.query(Producto).filter(
            Producto.modelo.like(f"%{modelo}%")
        ).all()

        resultado = []

        for producto in productos:

            promedio = db.query(
                func.avg(Calificacion.estrellas)
            ).filter(
                Calificacion.modelo == producto.modelo
            ).scalar()

            resultado.append({
            "modelo": producto.modelo,
            "imagen": producto.imagen,
            "descripcion": producto.descripcion,

            "id_marca": producto.id_marca,
            "id_categoria": producto.marca.id_categoria,
            "id_tipo": producto.id_tipo,
            "id_gamma": producto.id_gamma,

            "marca": producto.marca.nombre,
            "categoria": producto.marca.categoria.nombre,
            "tipo": producto.tipo.nombre,
            "gamma": producto.gamma.nombre
        })

        return resultado

    finally:
        db.close()


# =========================
# FILTRAR POR MARCA
# =========================

@router.get("/productos/marca/{marca}")
def filtrar_por_marca(marca: str):

    db = SessionLocal()

    try:

        productos = db.query(Producto).join(Marca).filter(
            Marca.nombre == marca
        ).all()

        resultado = []

        for producto in productos:

            promedio = db.query(
                func.avg(Calificacion.estrellas)
            ).filter(
                Calificacion.modelo == producto.modelo
            ).scalar()

            resultado.append({
                "modelo": producto.modelo,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
                "estrellas": int(promedio or 0),
                "marca": producto.marca.nombre,
                "categoria": producto.marca.categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })

        return resultado

    finally:
        db.close()


# =========================
# FILTRAR POR TIPO
# =========================

@router.get("/productos/tipo/{tipo}")
def filtrar_por_tipo(tipo: str):

    db = SessionLocal()

    try:

        productos = db.query(Producto).join(Tipo).filter(
            Tipo.nombre == tipo
        ).all()

        resultado = []

        for producto in productos:

            promedio = db.query(
                func.avg(Calificacion.estrellas)
            ).filter(
                Calificacion.modelo == producto.modelo
            ).scalar()

            resultado.append({
                "modelo": producto.modelo,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
                "estrellas": int(promedio or 0),
                "marca": producto.marca.nombre,
                "categoria": producto.marca.categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })

        return resultado

    finally:
        db.close()


# =========================
# FILTRAR POR GAMMA
# =========================

@router.get("/productos/gamma/{gamma}")
def filtrar_por_gamma(gamma: str):

    db = SessionLocal()

    try:

        productos = db.query(Producto).join(Gamma).filter(
            Gamma.nombre == gamma
        ).all()

        resultado = []

        for producto in productos:

            promedio = db.query(
                func.avg(Calificacion.estrellas)
            ).filter(
                Calificacion.modelo == producto.modelo
            ).scalar()

            resultado.append({
                "modelo": producto.modelo,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
                "estrellas": int(promedio or 0),
                "marca": producto.marca.nombre,
                "categoria": producto.marca.categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })

        return resultado

    finally:
        db.close()


# =========================
# AGREGAR PRODUCTO
# =========================

@router.post("/productos")
def agregar_producto(datos: ProductoCreate):

    db = SessionLocal()

    try:

        producto_existente = db.query(Producto).filter(
            Producto.modelo == datos.modelo
        ).first()

        if producto_existente:
            raise HTTPException(
                status_code=400,
                detail="El producto ya existe"
            )

        nuevo_producto = Producto(
            modelo=datos.modelo,
            imagen=datos.imagen,
            descripcion=datos.descripcion,
            novedad=datos.novedad,
            id_marca=datos.id_marca,
            id_categoria=datos.id_categoria,
            id_tipo=datos.id_tipo,
            id_gamma=datos.id_gamma
        )

        db.add(nuevo_producto)
        db.commit()

        return {
            "mensaje": "Producto agregado correctamente"
        }

    finally:
        db.close()


# =========================
# ACTUALIZAR PRODUCTO
# =========================

@router.put("/productos/{modelo}")
def actualizar_producto(
    modelo: str,
    datos: ProductoCreate
):

    db = SessionLocal()

    try:

        producto = db.query(Producto).filter(
            Producto.modelo == modelo
        ).first()

        if not producto:
            raise HTTPException(
                status_code=404,
                detail="Producto no encontrado"
            )

        producto.modelo = datos.modelo
        producto.imagen = datos.imagen
        producto.descripcion = datos.descripcion
        producto.novedad = datos.novedad

        producto.id_marca = datos.id_marca
        producto.id_categoria = datos.id_categoria
        producto.id_tipo = datos.id_tipo
        producto.id_gamma = datos.id_gamma

        db.commit()

        return {
            "mensaje": "Producto actualizado correctamente"
        }

    finally:
        db.close()


# =========================
# ELIMINAR PRODUCTO
# =========================

@router.delete("/productos/{modelo}")
def eliminar_producto(modelo: str):

    db = SessionLocal()

    try:

        producto = db.query(Producto).filter(
            Producto.modelo == modelo
        ).first()

        if not producto:
            raise HTTPException(
                status_code=404,
                detail="Producto no encontrado"
            )

        db.delete(producto)
        db.commit()

        return {
            "mensaje": "Producto eliminado correctamente"
        }

    finally:
        db.close()
        
# =========================
# OBTENER MARCAS
# =========================

@router.get("/marcas")
def obtener_marcas():

    db = SessionLocal()

    try:

        marcas = db.query(Marca).all()

        return [
            {
                "id": marca.id_marca,
                "nombre": marca.nombre
            }
            for marca in marcas
        ]

    finally:
        db.close()


# =========================
# OBTENER CATEGORIAS
# =========================

@router.get("/categorias")
def obtener_categorias():

    db = SessionLocal()

    try:

        categorias = db.query(Categoria).all()

        return [
            {
                "id": categoria.id_categoria,
                "nombre": categoria.nombre
            }
            for categoria in categorias
        ]

    finally:
        db.close()


# =========================
# OBTENER TIPOS
# =========================

@router.get("/tipos")
def obtener_tipos():

    db = SessionLocal()

    try:

        tipos = db.query(Tipo).all()

        return [
            {
                "id": tipo.id_tipo,
                "nombre": tipo.nombre
            }
            for tipo in tipos
        ]

    finally:
        db.close()


# =========================
# OBTENER GAMMAS
# =========================

@router.get("/gammas")
def obtener_gammas():

    db = SessionLocal()

    try:

        gammas = db.query(Gamma).all()

        return [
            {
                "id": gamma.id_gamma,
                "nombre": gamma.nombre
            }
            for gamma in gammas
        ]

    finally:
        db.close()        