from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import (Producto, 
                    Calificacion, 
                    Gamma, 
                    Marca, 
                    Categoria, 
                    Tipo, 
                    Familia, 
                    Usuario)
from sqlalchemy import func
from sqlalchemy import cast, Integer
from typing import Optional, List
from pydantic import BaseModel
from passlib.context import CryptContext

# ENDPOINTSs
from endPoints_Producto import router as productos_router
from datetime import date


class CalificacionRequest(BaseModel):
    modelo: str
    correo: str
    estrellas: int
    fecha: date


# Modelos Pydantic para respuestas
class ProductoResponse(BaseModel):
    modelo: str
    imagen: str
    descripcion: str
    estrellas: int
    marca: str
    categoria: str
    tipo: str
    gamma: str

class MarcaResponse(BaseModel):
    id_marca: int
    nombre: str
    imagen: Optional[str] = None


class SignInRequest(BaseModel):
    nombre: str
    apellido: str
    correo: str
    telefono: str
    contrasena: str


class LoginRequest(BaseModel):
    correo: str
    contrasena: str

app = FastAPI()
app.include_router(productos_router)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# ACTIVAR CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

@app.get("/")
def inicio():
    return {"mensaje": "Conectado a Casa Alvarado API"}

@app.get("/menu/categorias")
def obtener_menu():
    db = SessionLocal()

    try:

        familias = db.query(Familia).all()

        resultado = {}

        for familia in familias:

            categorias = db.query(Categoria).filter(
                Categoria.id_familia == familia.id_familia
            ).all()

            resultado[familia.nombre] = [
                categoria.nombre
                for categoria in categorias
            ]

        return resultado

    finally:
        db.close()
        
@app.get("/producto/{modelo}")
def obtener_producto(modelo: str):
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

        promedio = db.query(
            func.avg(Calificacion.estrellas)
        ).filter(
            Calificacion.modelo == modelo
        ).scalar()

        return {
            "modelo": producto.modelo,
            "imagen": producto.imagen,
            "descripcion": producto.descripcion,
            "estrellas": int(promedio or 0),
            "marca": producto.marca.nombre,
            "categoria": producto.marca.categoria.nombre,
            "tipo": producto.tipo.nombre,
            "gamma": producto.gamma.nombre
        }

    finally:
        db.close()
        
@app.get("/productos/novedades")
def obtener_productos_novedad():
    db = SessionLocal()

    try:
        productos = db.query(Producto).filter(
            Producto.novedad == 'Si'
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
        
@app.get("/productos/todos", response_model=List[ProductoResponse])
def obtener_todos_productos():
    db = SessionLocal()

    try:
        productos = (
            db.query(Producto)
            .join(Marca)
            .order_by(Marca.prioridad.asc())
            .all()
        )

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
                "marca": producto.marca.nombre,
                "categoria": producto.marca.categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })

        return resultado

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
            .join(Marca)
            .outerjoin(
                Calificacion,
                Producto.modelo == Calificacion.modelo
            )
            .filter(
                Marca.id_categoria == producto_actual.marca.id_categoria,
                Producto.modelo != modelo
            )
            .group_by(Producto.modelo)
            .order_by(func.avg(Calificacion.estrellas).desc())
            .limit(4)
            .all()
        )

        resultado = []
        for producto, promedio in similares:
            resultado.append({
                "modelo": producto.modelo,
                "imagen": producto.imagen,
                "descripcion": producto.descripcion,
                "marca": producto.marca.nombre,
                "categoria": producto.marca.categoria.nombre,
                "estrellas": round(promedio or 0, 1)
            })

        return resultado

    finally:
        db.close()

@app.get("/filtros/opciones")
def obtener_opciones_filtros():
    """Obtener todas las opciones de filtros disponibles"""
    db = SessionLocal()
    try:
        marcas = db.query(Marca.nombre).distinct().all()
        tipos = db.query(Tipo.nombre).distinct().all()
        gamas = db.query(Gamma.nombre).distinct().all()
        
        return {
            "marcas": [m[0] for m in marcas],
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
                "marca": producto.marca.nombre,
                "categoria": producto.marca.categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })
        
        return resultado
    finally:
        db.close()

@app.get("/productos/filtrar")
def filtrar_productos(
    marcas: Optional[str] = None,
    tipos: Optional[str] = None,
    gamas: Optional[str] = None
):
    """Filtrar productos por marca, tipo y/o gama"""
    db = SessionLocal()
    try:
        query = db.query(Producto)
        
        # Filtrar por marcas
        if marcas:
            lista_marcas = marcas.split(',')
            query = query.join(Marca).filter(Marca.nombre.in_(lista_marcas))
        
        # Filtrar por tipos
        if tipos:
            lista_tipos = tipos.split(',')
            query = query.join(Tipo).filter(Tipo.nombre.in_(lista_tipos))
        
        # Filtrar por gamas
        if gamas:
            lista_gamas = gamas.split(',')
            query = query.join(Gamma).filter(Gamma.nombre.in_(lista_gamas))
        
        productos = query.all()
        
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
                "marca": producto.marca.nombre,
                "categoria": producto.marca.categoria.nombre,
                "tipo": producto.tipo.nombre,
                "gamma": producto.gamma.nombre
            })
        
        return resultado
    finally:
        db.close()

# RUTAS DEL LOGIN Y SIGN IN
@app.post("/signin")
def signin(datos: SignInRequest):
    db = SessionLocal()

    try:

        usuario_existente = db.query(Usuario).filter(
            Usuario.correo == datos.correo
        ).first()

        if usuario_existente:
            raise HTTPException(
                status_code=400,
                detail="El correo ya está registrado"
            )

        # HASH DE CONTRASEÑA
        password_hashed = hash_password(
            datos.contrasena
        )

        nuevo_usuario = Usuario(
            correo=datos.correo,
            nombre=datos.nombre,
            apellido=datos.apellido,
            contrasena=password_hashed,
            telefono=datos.telefono
        )

        db.add(nuevo_usuario)
        db.commit()

        return {
            "mensaje": "Usuario registrado correctamente"
        }

    finally:
        db.close()

@app.post("/login")
def login(datos: LoginRequest):
    db = SessionLocal()
    try:
        usuario = db.query(Usuario).filter(
            Usuario.correo == datos.correo
        ).first()

        if not usuario:
            raise HTTPException(
                status_code=401,
                detail="Correo o contraseña incorrectos"
            )

        password_correcta = verify_password(
            datos.contrasena,
            usuario.contrasena
        )

        if not password_correcta:
            raise HTTPException(
                status_code=401,
                detail="Correo o contraseña incorrectos"
            )

        return {
            "mensaje": "Login exitoso",
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "correo": usuario.correo,
            "telefono": usuario.telefono,
            "rol": usuario.rol or 'Usuario'
        }
    finally:
        db.close()

# Endpoint para guardar calificación
@app.post("/calificacion")
def crear_calificacion(datos: CalificacionRequest):
    db = SessionLocal()
    try:
        # Verificar si ya existe calificación
        existe = db.query(Calificacion).filter(
            Calificacion.modelo == datos.modelo,
            Calificacion.correo == datos.correo
        ).first()
        
        if existe:
            # Actualizar
            existe.estrellas = datos.estrellas
            existe.fecha = datos.fecha
            db.commit()
        else:
            # Crear nueva
            nueva = Calificacion(
                modelo=datos.modelo,
                correo=datos.correo,
                estrellas=datos.estrellas,
                fecha=datos.fecha
            )
            db.add(nueva)
            db.commit()
        
        # Calcular nuevo promedio
        promedio = db.query(func.avg(Calificacion.estrellas)).filter(
            Calificacion.modelo == datos.modelo
        ).scalar()
        
        return {"mensaje": "Calificación guardada", "nuevoPromedio": int(promedio or 0)}
    finally:
        db.close()

# Endpoint para obtener calificación de un usuario
@app.get("/calificacion/usuario/{correo}/{modelo}")
def obtener_calificacion_usuario(correo: str, modelo: str):
    db = SessionLocal()
    try:
        calificacion = db.query(Calificacion).filter(
            Calificacion.modelo == modelo,
            Calificacion.correo == correo
        ).first()
        
        return {"calificacion": calificacion.estrellas if calificacion else None}
    finally:
        db.close()

# ========== ENDPOINTS PARA PRIORIDAD DE MARCAS ==========

@app.get("/categorias")
def obtener_categorias():
    """Obtener todas las categorías"""
    db = SessionLocal()
    try:
        categorias = db.query(Categoria).all()
        return [
            {
                "id": c.id_categoria,
                "nombre": c.nombre
            }
            for c in categorias
        ]
    finally:
        db.close()

@app.get("/marcas/categoria/{id_categoria}")
def obtener_marcas_por_categoria(id_categoria: int):
    """Obtener marcas por categoría"""
    db = SessionLocal()
    try:
        marcas = db.query(Marca).filter(Marca.id_categoria == id_categoria).all()
        return [
            {
                "id": m.id_marca,
                "nombre": m.nombre,
                "prioridad": m.prioridad
            }
            for m in marcas
        ]
    finally:
        db.close()

@app.put("/marcas/{id_marca}/prioridad")
def actualizar_prioridad_marca(id_marca: int, datos: dict):
    """Actualizar prioridad de una marca"""
    db = SessionLocal()
    try:
        marca = db.query(Marca).filter(Marca.id_marca == id_marca).first()
        
        if not marca:
            raise HTTPException(status_code=404, detail="Marca no encontrada")
        
        nueva_prioridad = datos.get("prioridad")
        if nueva_prioridad not in ['1', '2', '3']:
            raise HTTPException(status_code=400, detail="Prioridad debe ser 1, 2 o 3")
        
        marca.prioridad = nueva_prioridad
        db.commit()
        
        return {"mensaje": f"Prioridad de {marca.nombre} actualizada a {nueva_prioridad}"}
    finally:
        db.close()

@app.get("/marca/destacada")
def obtener_marca_destacada(categoria: str):

    print("Categoria recibida:", categoria)

    db = SessionLocal()

    try:

        marcas = (
            db.query(Marca)
            .join(Categoria, Marca.id_categoria == Categoria.id_categoria)
            .filter(Categoria.nombre == categoria)
            .all()
        )

        print("Marcas encontradas:", marcas)

        marca = (
            db.query(Marca)
            .join(Categoria, Marca.id_categoria == Categoria.id_categoria)
            .filter(
                Categoria.nombre == categoria,
                Marca.prioridad == 1
            )
            .first()
        )

        print("Marca destacada:", marca)

        if marca:

            return {
                "nombre": marca.nombre,
                "imagen": marca.imagen,
                "id_marca": marca.id_marca
            }

        return None

    finally:

        db.close()
 
@app.get("/marcas/carrusel")
def obtener_marcas_carrusel():

    db = SessionLocal()

    try:

        marcas = (
            db.query(Marca)
            .filter(Marca.prioridad == '1')
            .all()
        )

        return [
            {
                "nombre": marca.nombre,
                "imagen": marca.imagen,
                "id_marca": marca.id_marca
            }
            for marca in marcas
        ]

    finally:

        db.close()
               
@app.get("/marcas/todas")
def obtener_marcas(categoria: str):

    db = SessionLocal()

    try:

        marcas = (
            db.query(Marca)
            .join(
                Categoria,
                Marca.id_categoria == Categoria.id_categoria
            )
            .filter(Categoria.nombre == categoria)
            .order_by(cast(Marca.prioridad, Integer))
            .all()
        )

        return [
            {
                "nombre": marca.nombre,
                "imagen": marca.imagen,
                "id_marca": marca.id_marca,
                "prioridad": marca.prioridad
            }
            for marca in marcas
        ]

    finally:

        db.close()