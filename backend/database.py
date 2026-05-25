from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# CORREGIDO: URL completa con host, puerto y base de datos
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:JHwNsXUWdguEuIWyCYTnDxfsLQGfGRtQ@zephyr.proxy.rlwy.net:33741/Casa_Alvarado")

# Railway usa "mysql://" pero SQLAlchemy necesita "mysql+pymysql://"
if DATABASE_URL and DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

# Asegurar que usa la base correcta (Casa_Alvarado, no railway)
if DATABASE_URL and '/railway' in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace('/railway', '/Casa_Alvarado')

# Configuración CORREGIDA - SIN pool_size como argumento directo
# En su lugar, usamos argumentos válidos para PyMySQL
engine = create_engine(
    DATABASE_URL,
    pool_recycle=3600,  # Reciclar conexiones cada hora
    pool_pre_ping=True,  # Verificar conexión antes de usarla
    echo=False  # No mostrar SQL en consola
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

# Función para probar la conexión
def test_connection():
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
            print("✅ Conexión a MySQL exitosa")
            return True
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False