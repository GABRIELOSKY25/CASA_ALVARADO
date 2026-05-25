import pymysql

config = {
    'host': 'zephyr.proxy.rlwy.net',
    'user': 'root',
    'password': 'JHwNsXUWdguEuIWyCYTnDxfsLQGfGRtQ',
    'port': 33741,
    'database': 'railway',
    'charset': 'utf8mb4'
}

print("🔌 Conectando a Railway MySQL...")

try:
    conexion = pymysql.connect(**config)
    cursor = conexion.cursor()
    print("✅ Conectado exitosamente!")
    
    # LEER TU ARCHIVO SQL
    with open('C:/Users/arnol/Documents/CASA_ALVARADO/SQL/casa_alvarado.sql', 'r', encoding='utf-8') as archivo:
        sql_script = archivo.read()
    
    print("\n📦 Ejecutando tu script SQL...")
    
    # Ejecutar cada comando
    for comando in sql_script.split(';'):
        if comando.strip():
            cursor.execute(comando)
            print(f"  ✅ Comando ejecutado: {comando[:50]}...")
    
    conexion.commit()
    
    # Verificar tablas creadas
    cursor.execute("SHOW TABLES")
    tablas = cursor.fetchall()
    print("\n📋 Tablas en la base de datos:")
    for tabla in tablas:
        print(f"   - {tabla[0]}")
    
    print("\n🎉 ¡Script ejecutado exitosamente!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    if 'conexion' in locals():
        conexion.rollback()
finally:
    if 'conexion' in locals():
        conexion.close()