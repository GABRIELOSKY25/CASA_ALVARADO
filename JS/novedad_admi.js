const API_BASE =
    "https://TU-APP.up.railway.app";

let modeloActual = '';

// ============================
// BUSCAR PRODUCTO
// ============================
async function buscarProducto() {
    const buscarModelo = document.getElementById('buscarModelo');
    const modelo = buscarModelo?.value;
    const resultado = document.getElementById('resultado');
    
    if (!modelo) {
        alert('Ingrese un modelo para buscar');
        return;
    }
    
    try {
        const respuesta = await fetch(`${API_BASE}/productos/buscar/${modelo}`);
        const productos = await respuesta.json();
        
        if (productos.length === 0) {
            resultado.innerHTML = `
                <div class="no-encontrado">
                    <i class="fas fa-search" style="font-size: 40px; margin-bottom: 15px; display: block;"></i>
                    <p>Producto no encontrado</p>
                </div>
            `;
            return;
        }
        
        const producto = productos[0];
        modeloActual = producto.modelo;
        
        resultado.innerHTML = `
            <div class="card-novedad">
                <div class="novedad-imagen">
                    <img src="${producto.imagen}" alt="${producto.modelo}" onerror="this.src='https://via.placeholder.com/150x150?text=No+img'">
                </div>
                <div class="novedad-info">
                    <h2>${producto.modelo}</h2>
                    <p><i class="fas fa-trademark"></i> ${producto.marca}</p>
                    <p><i class="fas fa-folder"></i> ${producto.categoria}</p>
                    <div class="novedad-select">
                        <label>
                            <i class="fas fa-fire"></i> Marcar como novedad:
                        </label>
                        <select id="novedadSelect" class="select-novedad">
                            <option value="Si" ${producto.novedad === 'Si' ? 'selected' : ''}>Sí - Producto destacado</option>
                            <option value="No" ${producto.novedad === 'No' ? 'selected' : ''}>No - Producto normal</option>
                        </select>
                    </div>
                    <button class="btn-guardar" onclick="guardarNovedad()">
                        <i class="fas fa-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar el producto');
    }
}

// ============================
// GUARDAR NOVEDAD
// ============================
async function guardarNovedad() {
    const novedadSelect = document.getElementById('novedadSelect');
    const nuevaNovedad = novedadSelect?.value;
    
    try {
        // Obtener datos completos del producto
        const respuestaBuscar = await fetch(`${API_BASE}/productos/buscar/${modeloActual}`);
        const productos = await respuestaBuscar.json();
        const producto = productos[0];
        
        const datos = {
            modelo: producto.modelo,
            imagen: producto.imagen,
            descripcion: producto.descripcion,
            novedad: nuevaNovedad,
            id_marca: producto.id_marca,
            id_categoria: producto.id_categoria,
            id_tipo: producto.id_tipo,
            id_gamma: producto.id_gamma
        };
        
        const respuesta = await fetch(`${API_BASE}/productos/${modeloActual}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            alert(data.mensaje || 'Novedad actualizada correctamente');
            // Limpiar y recargar
            document.getElementById('resultado').innerHTML = '';
            document.getElementById('buscarModelo').value = '';
        } else {
            alert(data.detail || 'Error al actualizar la novedad');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
}