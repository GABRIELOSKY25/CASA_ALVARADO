const API_BASE = 'http://localhost:8000';
        
        let currentIndex = 0;
        let itemsPerView = 4;
        let todasLasMarcas = [];
        let productosCache = null;
        let filtrosGenerados = false;
        let timeoutBuscador = null;

        // ========== INICIALIZACIÓN ==========
        async function inicializar() {
    // Siempre cargar productos al inicio
            await cargarProductosUnaVez();
            
            // Generar filtros después de tener productos
            if (!filtrosGenerados && productosCache && productosCache.length) {
                await generarFiltrosDesdeProductos();
                filtrosGenerados = true;
            }
        }

        // Cargar productos desde la API
        async function cargarProductosUnaVez() {
            console.log('Intentando conectar a:', API_BASE);
            try {
                const response = await fetch(`${API_BASE}/productos/todos`);
                console.log('Respuesta status:', response.status);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const productos = await response.json();
                console.log('Productos cargados:', productos.length);
                productosCache = productos;
                renderizarProductos(productos);
                actualizarContadores(productos);
                return productos;
            } catch (error) {
                console.error('Error detallado:', error);
                document.getElementById('grid-productos').innerHTML = `<div class="mensaje-vacio">❌ Error: ${error.message}<br>¿FastAPI está corriendo en ${API_BASE}?</div>`;
                return [];
            }
        }

        async function generarFiltrosDesdeProductos() {
            try {
                if (!productosCache || !productosCache.length) {
                    console.log('No hay productos para generar filtros');
                    return;
                }
                
                // Solo Marca, Tipo y Gama
                const marcas = [...new Set(productosCache.map(p => p.marca))].sort();
                const tipos = [...new Set(productosCache.map(p => p.tipo))].sort();
                const gamas = [...new Set(productosCache.map(p => p.gamma))].sort();
                
                todasLasMarcas = marcas.map(nombre => ({ nombre, imagen: null }));
                
                generarHTMLFiltros(marcas, tipos, gamas);
                actualizarContadores(productosCache);
                
            } catch (error) {
                console.error('Error generando filtros:', error);
                document.getElementById('filtros-loading').innerHTML = '<div>Error al cargar filtros</div>';
            }
        }

        function generarHTMLFiltros(marcas, tipos, gamas) {
            const container = document.getElementById('filtros-container');
            
            let html = '<h2>Filtros</h2>';
            
            // Filtro Marcas
            html += `
                <div class="grupo_filtro">
                    <div class="filtro-header" onclick="toggleFiltro(this)">
                        <h3>Marca</h3>
                        <span class="flecha">▼</span>
                    </div>
                    <div class="filtro-contenido">
                        ${marcas.map(marca => `
                            <label class="opcion_filtro">
                                <input type="checkbox" value="${marca.replace(/"/g, '&quot;')}" class="filtro-marca" onchange="aplicarFiltros()">
                                ${marca}
                                <span class="contador" id="contador-marca-${marca.replace(/ /g, '-')}">(0)</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Filtro Tipos
            html += `
                <div class="grupo_filtro">
                    <div class="filtro-header" onclick="toggleFiltro(this)">
                        <h3>Tipo</h3>
                        <span class="flecha">▼</span>
                    </div>
                    <div class="filtro-contenido">
                        ${tipos.map(tipo => `
                            <label class="opcion_filtro">
                                <input type="checkbox" value="${tipo.replace(/"/g, '&quot;')}" class="filtro-tipo" onchange="aplicarFiltros()">
                                ${tipo}
                                <span class="contador" id="contador-tipo-${tipo.replace(/ /g, '-')}">(0)</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Filtro Gamas
            html += `
                <div class="grupo_filtro">
                    <div class="filtro-header" onclick="toggleFiltro(this)">
                        <h3>Gama</h3>
                        <span class="flecha">▼</span>
                    </div>
                    <div class="filtro-contenido">
                        ${gamas.map(gamma => `
                            <label class="opcion_filtro">
                                <input type="checkbox" value="${gamma.replace(/"/g, '&quot;')}" class="filtro-gamma" onchange="aplicarFiltros()">
                                ${gamma}
                                <span class="contador" id="contador-gamma-${gamma.replace(/ /g, '-')}">(0)</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            
            document.querySelectorAll('.filtro-contenido').forEach(contenido => {
                contenido.style.maxHeight = null;
            });
        }

        function aplicarFiltros() {
            if (!productosCache) return;
            
            document.querySelectorAll('.carrusel-item').forEach(i => i.classList.remove('activo'));
            
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
                // Limpiar el ID para que sea válido (reemplazar caracteres especiales)
                const idLimpio = nombre.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '-');
                const span = document.querySelector(`#contador-marca-${idLimpio}`);
                if (span) span.textContent = `(${total})`;
            });
            Object.entries(tipoCount).forEach(([nombre, total]) => {
                const idLimpio = nombre.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '-');
                const span = document.querySelector(`#contador-tipo-${idLimpio}`);
                if (span) span.textContent = `(${total})`;
            });
            Object.entries(gammaCount).forEach(([nombre, total]) => {
                const idLimpio = nombre.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '-');
                const span = document.querySelector(`#contador-gamma-${idLimpio}`);
                if (span) span.textContent = `(${total})`;
            });
        }

        function renderizarProductos(productos) {
            const grid = document.getElementById('grid-productos');
            
            if (!productos.length) {
                grid.innerHTML = '<div class="mensaje-vacio">⚠️ No hay productos con los filtros seleccionados</div>';
                return;
            }
            
            const estrellasHTML = (calificacion) => {
                const estrellas = Math.round(calificacion || 0);
                let stars = '';
                // Determinar el color según si hay calificación o no
                const colorEstrella = estrellas > 0 ? '#ffc107' : '#ccc';
                
                for (let i = 1; i <= 5; i++) {
                    const caracter = i <= estrellas ? '★' : '☆';
                    stars += `<span style="color: ${colorEstrella};">${caracter}</span>`;
                }
                return stars;
            };
            
            grid.innerHTML = productos.map(producto => `
                <div class="tarjeta_producto" 
                    data-marca="${producto.marca}"
                    data-categoria="${producto.categoria}"
                    data-tipo="${producto.tipo}"
                    data-gamma="${producto.gamma}">
                    <img src="${producto.imagen}" alt="${producto.modelo}" onerror="this.src='https://via.placeholder.com/300x220?text=Sin+imagen'">
                    <h3>${producto.modelo}</h3>
                    <p class="marca-producto">${producto.marca}</p>
                    <div class="rating">
                        <span class="rating-number">${producto.estrellas || 0}</span>
                        <span class="rating-stars">${estrellasHTML(producto.estrellas)}</span>
                    </div>
                    <a href="producto.html?modelo=${encodeURIComponent(producto.modelo)}" class="boton_producto">Ver más</a>
                </div>
            `).join('');
        }

        function toggleFiltro(header) {
            const grupo = header.parentElement;
            const contenido = grupo.querySelector('.filtro-contenido');
            const flecha = header.querySelector('.flecha');
            
            if (contenido.style.maxHeight) {
                contenido.style.maxHeight = null;
                if (flecha) flecha.style.transform = 'rotate(0deg)';
            } else {
                contenido.style.maxHeight = contenido.scrollHeight + "px";
                if (flecha) flecha.style.transform = 'rotate(180deg)';
            }
        }

        async function cargarCarruselMarcas() {
            try {
                const response = await fetch(`${API_BASE}/marcas/todas`);
                const marcas = await response.json();
                
                const track = document.getElementById('track');
                track.innerHTML = marcas.map(marca => `
                    <div class="carrusel-item" data-nombre="${marca.nombre}">
                        <img src="${marca.imagen || 'https://via.placeholder.com/180x80?text=' + marca.nombre}" alt="${marca.nombre}">
                    </div>
                `).join('');
                
                itemsPerView = getItemsPerView();
                updateCarrusel();
            } catch (error) {
                console.error('Error cargando marcas:', error);
            }
        }

        function getItemsPerView() {
            if (window.innerWidth >= 1024) return 4;
            if (window.innerWidth >= 768) return 3;
            return 2;
        }

        function updateCarrusel() {
            const track = document.getElementById('track');
            const items = document.querySelectorAll('.carrusel-item');
            if (!track || !items.length) return;
            const itemWidth = items[0]?.offsetWidth + 32;
            const desplazamiento = currentIndex * (itemWidth || 200);
            track.style.transform = `translateX(-${desplazamiento}px)`;
        }

        window.moverCarrusel = function(direction) {
            const items = document.querySelectorAll('.carrusel-item');
            const maxIndex = Math.max(0, items.length - itemsPerView);
            currentIndex += direction;
            if (currentIndex < 0) currentIndex = 0;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updateCarrusel();
        };

        window.addEventListener('resize', () => {
            itemsPerView = getItemsPerView();
            currentIndex = 0;
            updateCarrusel();
        });

        // ========== FILTRO POR CARRUSEL ==========
        function inicializarFiltroCarrusel() {
            const trackParaFiltros = document.getElementById('track');
            if (!trackParaFiltros) return;
            
            trackParaFiltros.addEventListener('click', (e) => {
                const item = e.target.closest('.carrusel-item');
                if (item) {
                    const marcaSeleccionada = item.getAttribute('data-nombre');
                    if (marcaSeleccionada) {
                        document.querySelectorAll('.carrusel-item').forEach(i => i.classList.remove('activo'));
                        item.classList.add('activo');
                        
                        const checkboxesMarcas = document.querySelectorAll('.filtro-marca');
                        checkboxesMarcas.forEach(cb => {
                            cb.checked = (cb.value === marcaSeleccionada);
                        });
                        
                        // Limpiar otros filtros
                        document.querySelectorAll('.filtro-tipo, .filtro-gamma').forEach(cb => cb.checked = false);
                        
                        aplicarFiltros();
                    }
                }
            });
        }

        // ========== BUSCADOR EN TIEMPO REAL ==========
        function inicializarBuscador() {
            const buscador = document.getElementById('buscador-productos');
            if (!buscador) return;
            
            buscador.addEventListener('input', function(e) {
                const terminoBusqueda = e.target.value.trim();
                
                if (timeoutBuscador) {
                    clearTimeout(timeoutBuscador);
                }
                
                if (terminoBusqueda === '') {
                    // Limpiar todos los filtros y mostrar todos los productos
                    document.querySelectorAll('.filtro-marca, .filtro-tipo, .filtro-gamma').forEach(cb => cb.checked = false);
                    document.querySelectorAll('.carrusel-item').forEach(i => i.classList.remove('activo'));
                    renderizarProductos(productosCache);
                    actualizarContadores(productosCache);
                    return;
                }
                
                if (terminoBusqueda.length < 2) {
                    return;
                }
                
                const grid = document.getElementById('grid-productos');
                grid.innerHTML = '<div class="loading">🔍 Buscando productos...</div>';
                
                timeoutBuscador = setTimeout(async () => {
                    try {
                        const response = await fetch(`${API_BASE}/productos/buscar/${encodeURIComponent(terminoBusqueda)}`);
                        
                        if (!response.ok) {
                            throw new Error('Error en la búsqueda');
                        }
                        
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

        // INICIALIZACIÓN
        document.addEventListener('DOMContentLoaded', () => {
            cargarCarruselMarcas();
            inicializar();  // Esta función ahora carga los productos
            inicializarBuscador();
            inicializarFiltroCarrusel();
        });