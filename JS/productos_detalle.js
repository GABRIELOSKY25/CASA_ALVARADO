// API Base URL
const API_BASE = 'https://casaalvarado-production.up.railway.app';

// Número de WhatsApp de la tienda
const WHATSAPP_NUMBER = "29611543145";

// Obtener modelo de producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const modeloProducto = urlParams.get('modelo');

// ========== FUNCIONES PARA PRESERVAR FILTROS ==========
function obtenerParametrosCatalogo() {
    // Primero intentar obtener de localStorage
    const paramsGuardados = localStorage.getItem('catalogo_params');
    if (paramsGuardados) {
        return JSON.parse(paramsGuardados);
    }
    
    // Si no hay guardados, intentar obtener de la URL actual (referrer)
    const referrer = document.referrer;
    if (referrer && referrer.includes('catalogo.html')) {
        const url = new URL(referrer);
        return {
            familia: url.searchParams.get('familia') || '',
            categoria: url.searchParams.get('categoria') || ''
        };
    }
    
    return { familia: '', categoria: '' };
}

function guardarParametrosCatalogo(familia, categoria) {
    if (familia || categoria) {
        localStorage.setItem('catalogo_params', JSON.stringify({ familia, categoria }));
    }
}

function getUrlCatalogoConFiltros() {
    const params = obtenerParametrosCatalogo();
    let urlCatalogo = '/Paginas/catalogo.html';
    
    if (params.familia || params.categoria) {
        const queryParams = [];
        if (params.familia) queryParams.push(`familia=${encodeURIComponent(params.familia)}`);
        if (params.categoria) queryParams.push(`categoria=${encodeURIComponent(params.categoria)}`);
        urlCatalogo = `/Paginas/catalogo.html?${queryParams.join('&')}`;
    }
    
    return urlCatalogo;
}

// ========== CARGAR PRODUCTO PRINCIPAL ==========
async function cargarProducto() {
    if (!modeloProducto) {
        console.error('No se especificó modelo de producto');
        window.location.href = getUrlCatalogoConFiltros();
        return;
    }

    // Guardar los parámetros de la URL de referencia (desde catálogo)
    const referrer = document.referrer;
    if (referrer && referrer.includes('catalogo.html')) {
        const url = new URL(referrer);
        const familia = url.searchParams.get('familia') || '';
        const categoria = url.searchParams.get('categoria') || '';
        guardarParametrosCatalogo(familia, categoria);
    }

    try {
        const response = await fetch(
            `${API_BASE}/producto/${encodeURIComponent(modeloProducto)}`
        );

        if (!response.ok) {
            throw new Error('Producto no encontrado');
        }

        const producto = await response.json();

        console.log('Producto cargado:', producto);

        // ========= TÍTULO =========
        document.title = `${producto.modelo} - Casa Alvarado`;

        // ========= IMAGEN =========
        const imgElement = document.getElementById('producto-img');
        if (imgElement) {
            imgElement.src = producto.imagen;
            imgElement.alt = producto.modelo;
            imgElement.onerror = () => {
                imgElement.src = 'https://via.placeholder.com/300x220?text=Sin+imagen';
            };
        }

        // ========= MARCA =========
        document.querySelectorAll('#producto-marca').forEach(el => {
            el.textContent = producto.marca || '';
        });

        // ========= MODELO =========
        const modeloElement = document.getElementById('producto-modelo');
        if (modeloElement) {
            modeloElement.textContent = producto.modelo || '';
        }

        // ========= DESCRIPCIÓN =========
        const descripcionElement = document.getElementById('producto-descripcion');
        if (descripcionElement) {
            descripcionElement.textContent = producto.descripcion || '';
        }

        // ========= CALIFICACIÓN =========
        const estrellas = Number(producto.estrellas || 0);
        const ratingNumElement = document.getElementById('rating-num');
        if (ratingNumElement) {
            ratingNumElement.textContent = `${estrellas} / 5`;
        }

        generarEstrellasVisuales(estrellas);

        // ========= WHATSAPP =========
        configurarWhatsApp(producto);

        // ========= PRODUCTOS SIMILARES =========
        await cargarProductosSimilares(producto.modelo);

    } catch (error) {
        console.error('Error cargando producto:', error);
        mostrarError('No se pudo cargar el producto.');
    }
}

// ========== GENERAR ESTRELLAS VISUALES ==========
function generarEstrellasVisuales(calificacion) {
    const estrellasContainer = document.getElementById('rating-stars-display');
    if (!estrellasContainer) return;

    const estrellas = Math.round(calificacion || 0);
    const tieneCalificacion = estrellas > 0;
    const colorEstrella = tieneCalificacion ? '#ffc107' : '#ccc';
    
    let estrellasHTML = '';
    for (let i = 1; i <= 5; i++) {
        const caracter = i <= estrellas ? '★' : '☆';
        estrellasHTML += `<span style="color: ${colorEstrella}; font-size: 1.5rem;">${caracter}</span>`;
    }
    
    estrellasContainer.innerHTML = estrellasHTML;
}

// ========== CONFIGURAR BOTÓN DE WHATSAPP ==========
function configurarWhatsApp(producto) {
    const btnWhatsApp = document.getElementById('btn-contactar');
    if (!btnWhatsApp) return;

    const mensaje = `Hola Casa Alvarado, me interesa el producto: ${producto.modelo} - Marca: ${producto.marca}`;
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(mensaje)}`;
    
    btnWhatsApp.addEventListener('click', () => {
        window.open(urlWhatsApp, '_blank');
    });
}

// ========== CARGAR PRODUCTOS SIMILARES ==========
async function cargarProductosSimilares(modelo) {
    const contenedor = document.getElementById("productos-similares");
    if (!contenedor) return;
    
    contenedor.innerHTML = '<div class="loading">🔄 Cargando productos similares...</div>';

    try {
        const response = await fetch(`${API_BASE}/productos-similares/${modelo}`);
        
        if (!response.ok) throw new Error('Error al cargar productos similares');
        
        const productos = await response.json();
        
        contenedor.innerHTML = "";
        
        if (productos.length === 0) {
            contenedor.innerHTML = '<div class="mensaje-vacio">⚠️ No hay productos similares disponibles</div>';
            return;
        }
        
        const estrellasHTML = (calificacion) => {
            const estrellas = Math.round(calificacion || 0);
            let stars = '';
            const colorEstrella = estrellas > 0 ? '#ffc107' : '#ccc';
            
            for (let i = 1; i <= 5; i++) {
                const caracter = i <= estrellas ? '★' : '☆';
                stars += `<span style="color: ${colorEstrella};">${caracter}</span>`;
            }
            return stars;
        };
        
        // Obtener parámetros para los enlaces
        const params = obtenerParametrosCatalogo();
        
        productos.forEach(producto => {
            let urlProducto = `producto.html?modelo=${encodeURIComponent(producto.modelo)}`;
            if (params.familia) urlProducto += `&familia=${encodeURIComponent(params.familia)}`;
            if (params.categoria) urlProducto += `&categoria=${encodeURIComponent(params.categoria)}`;
            
            contenedor.innerHTML += `
                <div class="tarjeta_producto">
                    <img src="${producto.imagen}" alt="${producto.modelo}" onerror="this.src='https://via.placeholder.com/300x220?text=Sin+imagen'">
                    <h3>${producto.modelo}</h3>
                    <p class="marca-producto">${producto.marca || ''}</p>
                    <div class="rating">
                        <span class="rating-number">${producto.estrellas || 0}</span>
                        <span class="rating-stars">${estrellasHTML(producto.estrellas)}</span>
                    </div>
                    <a href="${urlProducto}" class="boton_producto">Ver más</a>
                </div>
            `;
        });
        
    } catch(error) {
        console.error('Error cargando similares:', error);
        contenedor.innerHTML = '<div class="error-mensaje">❌ Error al cargar productos similares</div>';
    }
}

// ========== MOSTRAR ERROR CON BOTÓN INTELIGENTE ==========
function mostrarError(mensaje) {
    const productoInfo = document.querySelector('.producto_info');
    if (productoInfo) {
        const urlCatalogo = getUrlCatalogoConFiltros();
        
        productoInfo.innerHTML = `
            <div class="error-mensaje" style="text-align: center; padding: 2rem;">
                <h3>⚠️ Error</h3>
                <p>${mensaje}</p>
                <a href="${urlCatalogo}" class="btn btn_volver" style="margin-top: 1rem; display: inline-block;">← Volver al catálogo</a>
            </div>
        `;
    }
}

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', () => {
    cargarProducto();
});