const API_BASE =
    "https://TU-APP.up.railway.app";
let modeloEliminar = '';

// ============================
// BUSCAR PRODUCTO
// ============================
async function buscarProducto() {
    const modeloInput = document.getElementById('modeloEliminarInput');
    const modelo = modeloInput?.value;
    
    if (!modelo) {
        alert('Ingrese un modelo para buscar');
        return;
    }
    
    try {
        const respuesta = await fetch(`${API_BASE}/productos/buscar/${modelo}`);
        const productos = await respuesta.json();
        const resultado = document.getElementById('resultado');
        
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
        modeloEliminar = producto.modelo;
        
        resultado.innerHTML = `
            <table class="tabla-producto">
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Modelo</th>
                        <th>Marca</th>
                        <th>Tipo</th>
                        <th>Gamma</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><img src="${producto.imagen}" alt="${producto.modelo}" onerror="this.src='https://via.placeholder.com/50x50?text=No+img'"></td>
                        <td>${producto.modelo}</td>
                        <td>${producto.marca}</td>
                        <td>${producto.tipo}</td>
                        <td>${producto.gamma}</td>
                    </tr>
                </tbody>
            </table>
            <button class="btn-eliminar" onclick="eliminarProducto()">
                <i class="fas fa-trash-alt"></i> Confirmar Eliminación
            </button>
        `;
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar el producto');
    }
}

// ============================
// ELIMINAR PRODUCTO
// ============================
async function eliminarProducto() {
    const confirmar = confirm(`¿Está seguro que desea eliminar el producto "${modeloEliminar}"?\n\nEsta acción no se puede deshacer.`);
    
    if (!confirmar) return;
    
    try {
        const respuesta = await fetch(`${API_BASE}/productos/${modeloEliminar}`, {
            method: 'DELETE'
        });
        
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            alert(data.mensaje || 'Producto eliminado correctamente');
            // Limpiar el resultado y el input
            document.getElementById('resultado').innerHTML = '';
            document.getElementById('modeloEliminarInput').value = '';
        } else {
            alert(data.detail || 'Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
}