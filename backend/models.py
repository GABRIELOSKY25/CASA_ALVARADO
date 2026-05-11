from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from database import Base


# =========================
# CATEGORIA
# =========================
class Categoria(Base):
    __tablename__ = "Categoria"

    id_categoria = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(45), nullable=False)


# =========================
# MARCA
# =========================
class Marca(Base):
    __tablename__ = "Marca"

    id_marca = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(45), nullable=False)
    imagen = Column(Text)


# =========================
# SUB CATEGORIA
# =========================
class Sub_categoria(Base):
    __tablename__ = "Sub_categoria"

    id_sub_categoria = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(45), nullable=False)


# =========================
# TIPO
# =========================
class Tipo(Base):
    __tablename__ = "Tipo"

    id_tipo = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(45), nullable=False)


# =========================
# GAMMA
# =========================
class Gamma(Base):
    __tablename__ = "Gamma"

    id_gamma = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(45), nullable=False)


# =========================
# PRODUCTO
# =========================
class Producto(Base):
    __tablename__ = "Producto"

    modelo = Column(String(45), primary_key=True)
    imagen = Column(Text, nullable=False)
    descripcion = Column(Text, nullable=False)

    # 🔑 FOREIGN KEYS
    id_categoria = Column(Integer, ForeignKey("Categoria.id_categoria"), nullable=False)
    id_marca = Column(Integer, ForeignKey("Marca.id_marca"), nullable=False)
    id_sub_categoria = Column(Integer, ForeignKey("Sub_categoria.id_sub_categoria"), nullable=False)
    id_tipo = Column(Integer, ForeignKey("Tipo.id_tipo"), nullable=False)
    id_gamma = Column(Integer, ForeignKey("Gamma.id_gamma"), nullable=False)

    # 🔥 RELACIONES (esto reemplaza los IDs en respuestas)
    categoria = relationship("Categoria")
    marca = relationship("Marca")
    sub_categoria = relationship("Sub_categoria")
    tipo = relationship("Tipo")
    gamma = relationship("Gamma")

    # relación con calificaciones
    calificaciones = relationship(
        "Calificacion",
        back_populates="producto",
        cascade="all, delete"
    )


# =========================
# CALIFICACION
# =========================
class Calificacion(Base):
    __tablename__ = "Calificacion"

    id_calificacion = Column(Integer, primary_key=True, autoincrement=True)
    estrellas = Column(Integer, nullable=False)
    fecha = Column(Date)

    modelo = Column(
        String(45),
        ForeignKey("Producto.modelo", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False
    )

    # relación inversa
    producto = relationship("Producto", back_populates="calificaciones")