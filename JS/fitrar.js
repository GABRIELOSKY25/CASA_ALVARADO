// ========== FILTRO POR CARRUSEL DE MARCAS ==========
function inicializarFiltroCarrusel() {
    const trackParaFiltros = document.getElementById('track');
    
    if (!trackParaFiltros) return;
    
    trackParaFiltros.addEventListener('click', (e) => {
        const item = e.target.closest('.carrusel-item');
        
        if (item) {
            const marcaSeleccionada = item.getAttribute('data-nombre');
            
            if (marcaSeleccionada) {
                // 1. Efecto visual opcional: marcar como activo
                document.querySelectorAll('.carrusel-item').forEach(i => i.classList.remove('activo'));
                item.classList.add('activo');
                
                // 2. Limpiar los checkboxes de marcas (para no duplicar filtros)
                const checkboxesMarcas = document.querySelectorAll('.filtro-marca');
                checkboxesMarcas.forEach(cb => {
                    if (cb.value === marcaSeleccionada) {
                        cb.checked = true;
                    } else {
                        cb.checked = false;
                    }
                });
                
                // 3. Aplicar el filtro
                filtrarProductosPorMarca(marcaSeleccionada);
            }
        }
    });
}

function filtrarProductosPorMarca(marca) {
    if (!productosCache) return;
    
    console.log(`Filtrando productos por marca: ${marca}`);
    
    // Limpiar otros filtros (categoría, tipo, gama) pero mantener la marca seleccionada
    const checkboxesCategorias = document.querySelectorAll('.filtro-categoria');
    const checkboxesTipos = document.querySelectorAll('.filtro-tipo');
    const checkboxesGamas = document.querySelectorAll('.filtro-gamma');
    
    checkboxesCategorias.forEach(cb => cb.checked = false);
    checkboxesTipos.forEach(cb => cb.checked = false);
    checkboxesGamas.forEach(cb => cb.checked = false);
    
    // Filtrar productos por la marca seleccionada
    let productosFiltrados = productosCache.filter(p => p.marca === marca);
    
    // Limpiar el buscador si tiene texto
    const buscador = document.getElementById('buscador-productos');
    if (buscador) {
        buscador.value = '';
    }
    
    // Actualizar contadores y renderizar
    actualizarContadores(productosFiltrados);
    renderizarProductos(productosFiltrados);
    
    // Mostrar mensaje si no hay productos de esa marca
    if (productosFiltrados.length === 0) {
        const grid = document.getElementById('grid-productos');
        grid.innerHTML = `<div class="mensaje-vacio">📦 No hay productos disponibles de la marca ${marca}</div>`;
    }
}

let timeoutBuscador = null; // Para debounce (evitar muchas consultas)

// ========== BUSCADOR EN TIEMPO REAL ==========
function inicializarBuscador() {
    const buscador = document.getElementById('buscador-productos');
    if (!buscador) return;
    
    buscador.addEventListener('input', function(e) {
        const terminoBusqueda = e.target.value.trim();
        
        // Limpiar el timeout anterior
        if (timeoutBuscador) {
            clearTimeout(timeoutBuscador);
        }
        
        // Si no hay término, recargar todos los productos
        if (terminoBusqueda === '') {
            cargarProductosUnaVez();
            return;
        }
        
        // Si tiene menos de 2 caracteres, no buscar (opcional)
        if (terminoBusqueda.length < 2) {
            return;
        }
        
        // Mostrar indicador de carga en el grid
        const grid = document.getElementById('grid-productos');
        grid.innerHTML = '<div class="loading">🔍 Buscando productos...</div>';
        
        // Esperar 300ms después de que el usuario deje de escribir
        timeoutBuscador = setTimeout(async () => {
            try {
                // Hacer la consulta a la API
                const response = await fetch(`${API_BASE}/productos/buscar/${encodeURIComponent(terminoBusqueda)}`);
                
                if (!response.ok) {
                    throw new Error('Error en la búsqueda');
                }
                
                const productos = await response.json();
                
                // Actualizar el caché con los resultados de búsqueda
                productosCache = productos;
                window.todosLosProductos = productos;
                
                // Renderizar resultados
                renderizarProductos(productos);
                
                // Actualizar contadores (solo con los resultados encontrados)
                actualizarContadores(productos);
                
                // Mostrar mensaje si no hay resultados
                if (productos.length === 0) {
                    grid.innerHTML = `<div class="mensaje-vacio">🔍 No se encontraron productos que coincidan con "${terminoBusqueda}"</div>`;
                }
                
            } catch (error) {
                console.error('Error en búsqueda:', error);
                grid.innerHTML = '<div class="error-mensaje">❌ Error al buscar productos</div>';
            }
        }, 300); // Espera 300ms después de la última pulsación
    });
}

// Modificar la función aplicarFiltros existente para que también limpie el carrusel
// Reemplaza la función aplicarFiltros actual con esta:
function aplicarFiltros() {
    if (!productosCache) return;
    
    // Limpiar selección activa del carrusel
    document.querySelectorAll('.carrusel-item').forEach(i => i.classList.remove('activo'));
    
    const marcasSeleccionadas = Array.from(document.querySelectorAll('.filtro-marca:checked')).map(cb => cb.value);
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('.filtro-categoria:checked')).map(cb => cb.value);
    const tiposSeleccionados = Array.from(document.querySelectorAll('.filtro-tipo:checked')).map(cb => cb.value);
    const gamasSeleccionadas = Array.from(document.querySelectorAll('.filtro-gamma:checked')).map(cb => cb.value);
    
    // Obtener término de búsqueda actual
    const terminoBusqueda = document.getElementById('buscador-productos')?.value.toLowerCase().trim() || '';
    
    let productosFiltrados = [...productosCache];
    
    // Aplicar filtros de checkboxes
    if (marcasSeleccionadas.length) {
        productosFiltrados = productosFiltrados.filter(p => marcasSeleccionadas.includes(p.marca));
    }
    if (categoriasSeleccionadas.length) {
        productosFiltrados = productosFiltrados.filter(p => categoriasSeleccionadas.includes(p.categoria));
    }
    if (tiposSeleccionados.length) {
        productosFiltrados = productosFiltrados.filter(p => tiposSeleccionados.includes(p.tipo));
    }
    if (gamasSeleccionadas.length) {
        productosFiltrados = productosFiltrados.filter(p => gamasSeleccionadas.includes(p.gamma));
    }
    
    // Aplicar búsqueda si hay término
    if (terminoBusqueda !== '') {
        productosFiltrados = productosFiltrados.filter(p => 
            p.modelo.toLowerCase().includes(terminoBusqueda) || 
            p.marca.toLowerCase().includes(terminoBusqueda)
        );
    }
    
    actualizarContadores(productosFiltrados);
    renderizarProductos(productosFiltrados);
    
    // Mostrar mensaje si no hay resultados
    if (productosFiltrados.length === 0 && terminoBusqueda !== '') {
        const grid = document.getElementById('grid-productos');
        grid.innerHTML = `<div class="mensaje-vacio">🔍 No se encontraron productos que coincidan con "${terminoBusqueda}"</div>`;
    }
}

// Modificar la inicialización para incluir el filtro del carrusel
// Reemplaza la parte de DOMContentLoaded con esta:
document.addEventListener('DOMContentLoaded', () => {
    cargarCarruselMarcas();
    inicializar();
    inicializarBuscador();
    inicializarFiltroCarrusel();  // <--- Agrega esta línea
});