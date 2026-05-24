// ========== FILTRO POR CARRUSEL DE MARCAS ==========
function inicializarFiltroCarrusel() {
    const trackParaFiltros = document.getElementById('track');
    
    if (!trackParaFiltros) return;
    
    trackParaFiltros.addEventListener('click', (e) => {
        const item = e.target.closest('.carrusel-item');
        
        if (item) {
            const marcaSeleccionada = item.getAttribute('data-nombre');
            
            if (marcaSeleccionada) {
                // 1. Efecto visual: marcar como activo
                document.querySelectorAll('.carrusel-item').forEach(i => i.classList.remove('activo'));
                item.classList.add('activo');
                
                // 2. Limpiar otros filtros (Tipo y Gama)
                const checkboxesTipos = document.querySelectorAll('.filtro-tipo');
                const checkboxesGamas = document.querySelectorAll('.filtro-gamma');
                
                checkboxesTipos.forEach(cb => cb.checked = false);
                checkboxesGamas.forEach(cb => cb.checked = false);
                
                // 3. Marcar solo la marca seleccionada
                const checkboxesMarcas = document.querySelectorAll('.filtro-marca');
                checkboxesMarcas.forEach(cb => {
                    cb.checked = (cb.value === marcaSeleccionada);
                });
                
                // 4. Limpiar buscador
                const buscador = document.getElementById('buscador-productos');
                if (buscador) buscador.value = '';
                
                // 5. Aplicar filtro
                aplicarFiltros();
            }
        }
    });
}

// ========== FUNCIÓN PRINCIPAL DE FILTRADO ==========
function aplicarFiltros() {
    if (!productosCache) return;
    
    // Limpiar selección activa del carrusel
    document.querySelectorAll('.carrusel-item').forEach(i => i.classList.remove('activo'));
    
    // Obtener valores seleccionados (SOLO Marca, Tipo y Gama)
    const marcasSeleccionadas = Array.from(document.querySelectorAll('.filtro-marca:checked')).map(cb => cb.value);
    const tiposSeleccionados = Array.from(document.querySelectorAll('.filtro-tipo:checked')).map(cb => cb.value);
    const gamasSeleccionadas = Array.from(document.querySelectorAll('.filtro-gamma:checked')).map(cb => cb.value);
    
    // Si NO hay NINGÚN filtro seleccionado, mostrar TODOS los productos
    if (marcasSeleccionadas.length === 0 && tiposSeleccionados.length === 0 && gamasSeleccionadas.length === 0) {
        renderizarProductos(productosCache);
        actualizarContadores(productosCache);
        return;
    }
    
    // Aplicar filtros
    let productosFiltrados = [...productosCache];
    
    if (marcasSeleccionadas.length) {
        productosFiltrados = productosFiltrados.filter(p => marcasSeleccionadas.includes(p.marca));
    }
    if (tiposSeleccionados.length) {
        productosFiltrados = productosFiltrados.filter(p => tiposSeleccionados.includes(p.tipo));
    }
    if (gamasSeleccionadas.length) {
        productosFiltrados = productosFiltrados.filter(p => gamasSeleccionadas.includes(p.gamma));
    }
    
    actualizarContadores(productosFiltrados);
    renderizarProductos(productosFiltrados);
}

// ========== BUSCADOR EN TIEMPO REAL ==========
let timeoutBuscador = null;

function inicializarBuscador() {
    const buscador = document.getElementById('buscador-productos');
    if (!buscador) return;
    
    buscador.addEventListener('input', function(e) {
        const terminoBusqueda = e.target.value.trim();
        
        if (timeoutBuscador) clearTimeout(timeoutBuscador);
        
        // Si no hay término, mostrar todos los productos y limpiar filtros
        if (terminoBusqueda === '') {
            // Limpiar todos los checkboxes
            document.querySelectorAll('.filtro-marca, .filtro-tipo, .filtro-gamma').forEach(cb => cb.checked = false);
            document.querySelectorAll('.carrusel-item').forEach(i => i.classList.remove('activo'));
            renderizarProductos(productosCache);
            actualizarContadores(productosCache);
            return;
        }
        
        if (terminoBusqueda.length < 2) return;
        
        const grid = document.getElementById('grid-productos');
        grid.innerHTML = '<div class="loading">🔍 Buscando productos...</div>';
        
        timeoutBuscador = setTimeout(async () => {
            try {
                const response = await fetch(`${API_BASE}/productos/buscar/${encodeURIComponent(terminoBusqueda)}`);
                
                if (!response.ok) throw new Error('Error en la búsqueda');
                
                const productos = await response.json();
                renderizarProductos(productos);
                
                if (productos.length === 0) {
                    grid.innerHTML = `<div class="mensaje-vacio">🔍 No se encontraron productos que coincidan con "${terminoBusqueda}"</div>`;
                }
            } catch (error) {
                console.error('Error en búsqueda:', error);
                grid.innerHTML = '<div class="error-mensaje">❌ Error al buscar productos</div>';
            }
        }, 300);
    });
}

// ========== ACTUALIZAR CONTADORES ==========
function actualizarContadores(productos) {
    const marcaCount = {};
    const tipoCount = {};
    const gammaCount = {};
    
    productos.forEach(p => {
        marcaCount[p.marca] = (marcaCount[p.marca] || 0) + 1;
        tipoCount[p.tipo] = (tipoCount[p.tipo] || 0) + 1;
        gammaCount[p.gamma] = (gammaCount[p.gamma] || 0) + 1;
    });
    
    Object.entries(marcaCount).forEach(([nombre, total]) => {
        const span = document.querySelector(`#contador-marca-${nombre.replace(/ /g, '-')}`);
        if (span) span.textContent = `(${total})`;
    });
    Object.entries(tipoCount).forEach(([nombre, total]) => {
        const span = document.querySelector(`#contador-tipo-${nombre.replace(/ /g, '-')}`);
        if (span) span.textContent = `(${total})`;
    });
    Object.entries(gammaCount).forEach(([nombre, total]) => {
        const span = document.querySelector(`#contador-gamma-${nombre.replace(/ /g, '-')}`);
        if (span) span.textContent = `(${total})`;
    });
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    cargarCarruselMarcas();
    inicializar();
    inicializarBuscador();
    inicializarFiltroCarrusel();
});