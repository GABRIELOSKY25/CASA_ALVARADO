import pymysql

config = {
    'host': 'zephyr.proxy.rlwy.net',
    'user': 'root',
    'password': 'JHwNsXUWdguEuIWyCYTnDxfsLQGfGRtQ',
    'port': 33741,
    'database': 'Casa_Alvarado',
    'charset': 'utf8mb4'
}

print("🔌 Conectando a Railway MySQL...")
conexion = pymysql.connect(**config)
cursor = conexion.cursor()
print("✅ Conectado exitosamente!\n")

# ============================================
# PRIMERO: Ver qué datos ya existen
# ============================================
print("📋 Verificando datos existentes...")
cursor.execute("SELECT COUNT(*) FROM Familia")
familias_exist = cursor.fetchone()[0]
print(f"Familias existentes: {familias_exist}")

cursor.execute("SELECT COUNT(*) FROM Categoria")
categorias_exist = cursor.fetchone()[0]
print(f"Categorías existentes: {categorias_exist}")

# ============================================
# LIMPIAR TABLAS (si quieres reiniciar)
# ============================================
print("\n🗑️ Limpiando tablas existentes...")
cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
cursor.execute("TRUNCATE TABLE Calificacion")
cursor.execute("TRUNCATE TABLE Producto")
cursor.execute("TRUNCATE TABLE Categoria")
cursor.execute("TRUNCATE TABLE Marca")
cursor.execute("TRUNCATE TABLE Familia")
cursor.execute("TRUNCATE TABLE Gamma")
cursor.execute("TRUNCATE TABLE Tipo")
cursor.execute("TRUNCATE TABLE Usuario")
cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
print("   ✅ Tablas limpiadas\n")

# ============================================
# INSERT FAMILIA
# ============================================
print("📝 Insertando Familias...")
familias = [
    ('Audio',),
    ('Instrumentos',),
    ('Percursion',),
    ('Viento',),
    ('Teclados',),
    ('Iluminacion LED',)
]

for f in familias:
    cursor.execute("INSERT INTO Familia (nombre) VALUES (%s)", f)
print(f"   ✅ Insertadas {len(familias)} familias")

# ============================================
# INSERT CATEGORIA
# ============================================
print("\n📝 Insertando Categorias...")
categorias = [
    ('Microfono', 1),
    ('Mezcladora', 1),
    ('Bafles', 1),
    ('Cuerda', 2),
    ('Guitarras', 2),
    ('Bateria', 3),
    ('Timbales', 3),
    ('Bongos', 3),
    ('Congos', 3),
    ('Tarolas', 3),
    ('Panderos', 3),
    ('Saxofon', 4),
    ('Flauta', 4),
    ('Trompeta', 4),
    ('Teclados Electronicos', 5),
    ('Par LED', 6),
    ('Estrobos', 6),
    ('Cabeza Robotica', 6),
    ('Cabeza Movil', 6),
    ('Laser', 6)
]

for c in categorias:
    cursor.execute("INSERT INTO Categoria (nombre, id_familia) VALUES (%s, %s)", c)
print(f"   ✅ Insertadas {len(categorias)} categorias")

# ============================================
# INSERT MARCA
# ============================================
print("\n📝 Insertando Marcas...")
marcas = [
    ('SHURE', '', '3', 1), ('SUPERBRIGHT', '', '3', 1), ('KRIEG', '', '3', 1),
    ('ROMMS', '', '3', 1), ('RADOX', '', '3', 1), ('XSS J&B', '', '3', 1),
    ('AKG', '', '3', 1), ('KAPTON', '', '3', 1), ('SOUNDTRACK', '', '3', 1),
    ('TAIKA', '', '3', 1), ('LENNON', '', '3', 1), ('Krack', '', '3', 1),
    ('STAGG', '', '3', 1), ('Harden', '', '3', 2), ('Mackie', '', '3', 2),
    ('Vamav', '', '3', 2), ('Peavey', '', '3', 2), ('Vamav', '', '3', 3),
    ('QMC', '', '3', 3), ('Elipsis', '', '3', 3), ('Jbl', '', '3', 3),
    ('Victor', '', '3', 4), ('Alice', '', '3', 4), ('Eclipse', '', '3', 4),
    ('La bella', '', '3', 4), ('Jendrix', '', '3', 4), ('El cometa', '', '3', 4),
    ('Esmi', '', '3', 5), ('QTE', '', '3', 5), ('La sevillana', '', '3', 5),
    ('Segovia', '', '3', 5), ('Yamaha', '', '3', 5), ('Head-Pro', '', '3', 6),
    ('J.banks', '', '3', 6), ('Jendrix', '', '3', 6), ('J. banks', '', '3', 7),
    ('5 D2', '', '3', 8), ('Toca', '', '3', 9), ('Jendrix', '', '3', 9),
    ('New beat', '', '3', 10), ('J. Banks', '', '3', 10), ('Remo', '', '3', 11),
    ('Roms', '', '3', 11), ('Pandero acrilico', '', '3', 11), ('Eclipse', '', '3', 11),
    ('Acrilico', '', '3', 11), ('Silver-tone', '', '3', 12), ('Yamaha', '', '3', 13),
    ('Dislele', '', '3', 13), ('Extreme', '', '3', 13), ('Silver-tone', '', '3', 14),
    ('Yamaha', '', '3', 15), ('Elton', '', '3', 15), ('KSR', '', '3', 15),
    ('Super bright', '', '3', 16), ('Megaluz', '', '3', 16)
]

for m in marcas:
    cursor.execute("INSERT INTO Marca (nombre, imagen, prioridad, id_categoria) VALUES (%s, %s, %s, %s)", m)
print(f"   ✅ Insertadas {len(marcas)} marcas")

# ============================================
# INSERT GAMMA
# ============================================
print("\n📝 Insertando Gamas...")
gamas = [('Profesional',), ('Junior',)]
for g in gamas:
    cursor.execute("INSERT INTO Gamma (nombre) VALUES (%s)", g)
print(f"   ✅ Insertadas {len(gamas)} gamas")

# ============================================
# INSERT TIPO
# ============================================
print("\n📝 Insertando Tipos...")
tipos = [
    ('Alambrico',), ('Inalambrico',), ('Bateria',), ('Solapa',), ('Amplificada',),
    ('Pasiva',), ('Activo',), ('Nylon(Clasica)',), ('Metal(Acustica)',), ('Bajo Electrico',),
    ('Electrica',), ('Clasica/Acustica',), ('Acustico',), ('Electroacustica',), ('Docerola',),
    ('Electrica (Paquete)',), ('Acustica',), ('Estandar',), ('Madera',), ('Madera(Compacto)',),
    ('Metal',), ('Doble hilera',), ('Una hilera',), ('Circular',), ('Media luna'),
    ('Media luna (mediano)',), ('Media luna (Grande)',), ('Niquelado',), ('Digitacion barroca',),
    ('Escolar',), ('Portatil',), ('Par',), ('Estroboscopico',), ('Spot LED'), ('Multiefectos'),
    ('Triple de efectos'), ('Beam'), ('Spot'), ('Wash'), ('Laser')
]

for t in tipos:
    cursor.execute("INSERT INTO Tipo (nombre) VALUES (%s)", t)
print(f"   ✅ Insertados {len(tipos)} tipos")

# ============================================
# INSERTAR ALGUNOS PRODUCTOS DE EJEMPLO
# ============================================
print("\n📝 Insertando Productos de ejemplo...")
productos_ejemplo = [
    ('Microfono SHURE SV100', 'https://ejemplo.com/shure.jpg', 'Microfono profesional', 'No', 1, 1, 1),
    ('Microfono SHURE SM58', 'https://ejemplo.com/sm58.jpg', 'Microfono vocal dinamico', 'No', 1, 1, 1),
    ('Mezcladora Harden 8 Canales', 'https://ejemplo.com/harden.jpg', 'Mezcladora profesional', 'No', 14, 1, 6),
]

for prod in productos_ejemplo:
    try:
        cursor.execute("""INSERT INTO Producto 
            (modelo, imagen, descripcion, novedad, id_marca, id_gamma, id_tipo) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)""", prod)
    except Exception as e:
        print(f"   ⚠️ Error insertando producto: {e}")
print(f"   ✅ Insertados {len(productos_ejemplo)} productos de ejemplo")

# ============================================
# CONFIRMAR CAMBIOS
# ============================================
conexion.commit()

print("\n" + "="*50)
print("📊 VERIFICANDO DATOS")
print("="*50)

# Verificar cada tabla
tablas = ['Familia', 'Categoria', 'Marca', 'Gamma', 'Tipo', 'Producto']
for tabla in tablas:
    cursor.execute(f"SELECT COUNT(*) FROM {tabla}")
    count = cursor.fetchone()[0]
    print(f"📌 {tabla}: {count} registros")

print("\n✅ ¡Base de datos configurada exitosamente!")

# Mostrar ejemplos
print("\n📦 EJEMPLOS DE CATEGORÍAS:")
cursor.execute("SELECT c.nombre, f.nombre FROM Categoria c JOIN Familia f ON c.id_familia = f.id_familia LIMIT 5")
for cat, fam in cursor.fetchall():
    print(f"   - {cat} (Familia: {fam})")

print("\n🎉 ¡Listo! Tu base de datos está lista para usar.")

conexion.close()