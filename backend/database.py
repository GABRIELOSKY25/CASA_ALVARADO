from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Obtener URL de Railway
DATABASE_URL = os.getenv("DATABASE_URL")

# Si no hay variable de entorno, usar la URL manual
if not DATABASE_URL:
    DATABASE_URL = "mysql+pymysql://root:JHwNsXUWdguEuIWyCYTnDxfsLQGfGRtQ@zephyr.proxy.rlwy.net:33741/Casa_Alvarado"

# Convertir mysql:// a mysql+pymysql://
if DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)

# Asegurar que usa Casa_Alvarado
if '/railway' in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace('/railway', '/Casa_Alvarado')

print(f"📡 Conectando a: {DATABASE_URL.split('@')[1] if '@' in DATABASE_URL else 'base de datos'}")

# Configuración simple
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Función para probar la conexión CORREGIDA
def test_connection():
    try:
        with engine.connect() as conn:
            # Usar text() para consultas SQL
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
            print("✅ Conexión a MySQL exitosa")
            return True
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False