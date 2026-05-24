const API_BASE = 'http://localhost:8000';

let productosCache = [];

const tablaProductos = document.getElementById('tablaProductos');
const filtroCategoria = document.getElementById('filtroCategoria');
const filtroMarca = document.getElementById('filtroMarca');

// ==========================
// CARGAR PRODUCTOS
// ==========================
async function cargarProductos() {
    try {
        const res = await fetch(`${API_BASE}/productos/todos`);
        const productos = await res.json();
        productosCache = productos;
        generarCategorias();
        tablaProductos.innerHTML = '<tr><td colspan="5" class="loading">Selecciona una categoría para ver productos</td></tr>';
    } catch (error) {
        console.error('Error:', error);
        tablaProductos.innerHTML = '<tr><td colspan="5" class="loading">❌ Error al cargar productos</td></tr>';
    }
}

// ==========================
// GENERAR CATEGORÍAS
// ==========================
function generarCategorias() {
    const categorias = [...new Set(productosCache.map(p => p.categoria))];
    filtroCategoria.innerHTML = '<option value="">Selecciona una categoría</option>';
    categorias.forEach(categoria => {
        filtroCategoria.innerHTML += `<option value="${categoria}">${categoria}</option>`;
    });
}

// ==========================
// GENERAR MARCAS
// ==========================
function generarMarcas(productos) {
    filtroMarca.disabled = false;
    filtroMarca.innerHTML = '<option value="">Todas las marcas</option>';
    const marcas = [...new Set(productos.map(p => p.marca))];
    marcas.forEach(marca => {
        filtroMarca.innerHTML += `<option value="${marca}">${marca}</option>`;
    });
}

// ==========================
// CUANDO CAMBIA CATEGORÍA
// ==========================
filtroCategoria.addEventListener('change', () => {
    const categoria = filtroCategoria.value;
    
    if (!categoria) {
        filtroMarca.disabled = true;
        filtroMarca.innerHTML = '<option value="">Primero selecciona una categoría</option>';
        tablaProductos.innerHTML = '<tr><td colspan="5" class="loading">Selecciona una categoría para ver productos</td></tr>';
        return;
    }
    
    filtroMarca.disabled = false;
    const productosCategoria = productosCache.filter(p => p.categoria === categoria);
    generarMarcas(productosCategoria);
    renderizarProductos(productosCategoria);
});

// ==========================
// FILTRAR POR MARCA
// ==========================
filtroMarca.addEventListener('change', () => {
    const categoria = filtroCategoria.value;
    const marca = filtroMarca.value;
    
    if (!categoria) {
        tablaProductos.innerHTML = '<tr><td colspan="5" class="loading">Selecciona una categoría para ver productos</td></tr>';
        return;
    }
    
    let productos = productosCache.filter(p => p.categoria === categoria);
    if (marca && marca !== '') {
        productos = productos.filter(p => p.marca === marca);
    }
    renderizarProductos(productos);
});

// ==========================
// RENDERIZAR TABLA
// ==========================
function renderizarProductos(productos) {
    if (!productos.length) {
        tablaProductos.innerHTML = '<tr><td colspan="5" class="loading">⚠️ No hay productos en esta categoría</td></tr>';
        return;
    }
    
    tablaProductos.innerHTML = '';
    productos.forEach(producto => {
        tablaProductos.innerHTML += `
            <tr>
                <td><img src="${producto.imagen}" alt="${producto.modelo}" onerror="this.src='https://via.placeholder.com/50x50?text=No+img'"></td>
                <td>${producto.modelo}</td>
                <td>${producto.marca}</td>
                <td>${producto.tipo}</td>
                <td>${producto.gamma}</td>
            </tr>
        `;
    });
}

// Inicializar
cargarProductos();