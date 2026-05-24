from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# FORMATO:
# mysql+pymysql://usuario:password@host/basedatos

DATABASE_URL = "mysql+pymysql://root:@localhost:3308/casa_alvarado"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()