from sqlalchemy import Column, Integer, String, Text, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from database import Base


# =========================
# FAMILIA
# =========================
class Familia(Base):
    __tablename__ = "Familia"

    id_familia = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    nombre = Column(String(45), nullable=False)

    categorias = relationship(
        "Categoria",
        back_populates="familia"
    )


# =========================
# MARCA
# =========================
class Marca(Base):
    __tablename__ = "Marca"

    id_marca = Column(Integer, primary_key=True, autoincrement=True)

    nombre = Column(String(45), nullable=False)

    imagen = Column(Text)

    prioridad = Column(
        Enum('1', '2', '3'),
        nullable=False,
        default='3'
    )

    id_categoria = Column(
        Integer,
        ForeignKey("Categoria.id_categoria"),
        nullable=False
    )

    categoria = relationship("Categoria")
    
# =========================
# CATEGORIA
# =========================
class Categoria(Base):
    __tablename__ = "Categoria"

    id_categoria = Column(Integer, primary_key=True)
    nombre = Column(String(45))

    id_familia = Column(
        Integer,
        ForeignKey("Familia.id_familia")
    )

    familia = relationship(
        "Familia",
        back_populates="categorias"
    )


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
    novedad = Column(
    Enum('Si', 'No'),
    nullable=False,
    default='No'
)

    id_marca = Column(Integer, ForeignKey("Marca.id_marca"), nullable=False)
    id_tipo = Column(Integer, ForeignKey("Tipo.id_tipo"), nullable=False)
    id_gamma = Column(Integer, ForeignKey("Gamma.id_gamma"), nullable=False)

    marca = relationship("Marca")
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

    id_calificacion = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    estrellas = Column(Integer, nullable=False)

    fecha = Column(Date)

    modelo = Column(
        String(45),
        ForeignKey(
            "Producto.modelo",
            ondelete="CASCADE",
            onupdate="CASCADE"
        ),
        nullable=False
    )

    correo = Column(
        String(100),
        ForeignKey("Usuario.correo"),
        nullable=False
    )

    producto = relationship(
        "Producto",
        back_populates="calificaciones"
    )

    usuario = relationship("Usuario")

# =========================
# USUARIO
# =========================

class Usuario(Base):
    __tablename__ = "Usuario"

    correo = Column(Text, primary_key=True)
    nombre = Column(String(45), nullable=False)
    apellido = Column(String(45), nullable=False)
    contrasena = Column(Text, nullable=False)
    telefono = Column(String(15), nullable=False)