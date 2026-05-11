from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import SessionLocal
from models import Producto, Calificacion, Gamma  # Asegúrate de importar Gamma si lo usas
from sqlalchemy import func

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