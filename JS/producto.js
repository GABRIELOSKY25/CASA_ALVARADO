// API Base URL - CORREGIDO para Railway
const API_BASE = window.API_BASE || 'https://casaalvarado-production.up.railway.app';

// Número de WhatsApp de la tienda
const WHATSAPP_NUMBER = "529614049572";

// Obtener modelo de producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const modeloProducto = urlParams.get('modelo');

console.log('API_BASE:', API_BASE);
console.log('Modelo producto:', modeloProducto);

// ========== CARGAR PRODUCTO PRINCIPAL ==========
async function cargarProducto() {
    if (!modeloProducto) {
        console.error('No se especificó modelo de producto');
        window.location.href = 'catalogo.html';
        return;
    }

    try {
        const url = `${API_BASE}/producto/${encodeURIComponent(modeloProducto)}`;
        console.log('Fetching:', url);
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Producto no encontrado`);
        }

        const producto = await response.json();
        console.log('Producto cargado:', producto);

        // ========= TÍTULO =========
        document.title = `${producto.modelo} - Casa Alvarado`;

        // ========= IMAGEN =========
        const imgElement = document.getElementById('producto-img');
        if (imgElement) {
            imgElement.src = producto.imagen || 'https://via.placeholder.com/300x220?text=Sin+imagen';
            imgElement.alt = producto.modelo;
            imgElement.onerror = () => {
                imgElement.src = 'https://via.placeholder.com/300x220?text=Sin+imagen';
            };
        }

        // ========= MARCA =========
        const marcaElements = document.querySelectorAll('#producto-marca');
        marcaElements.forEach(el => {
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
        mostrarError('No se pudo cargar el producto: ' + error.message);
    }
}

// ========== GENERAR ESTRELLAS VISUALES ==========
function generarEstrellasVisuales(calificacion) {
    const estrellasContainer = document.getElementById('rating-stars-display');
    if (!estrellasContainer) return;

    const estrellas = Math.round(calificacion || 0);
    let estrellasHTML = '';
    for (let i = 1; i <= 5; i++) {
        const caracter = i <= estrellas ? '★' : '☆';
        estrellasHTML += `<span style="color: #ffc107; font-size: 1.5rem;">${caracter}</span>`;
    }
    estrellasContainer.innerHTML = estrellasHTML;
}

// ========== CONFIGURAR BOTÓN DE WHATSAPP ==========
function configurarWhatsApp(producto) {
    const btnWhatsApp = document.getElementById('btn-contactar');
    if (!btnWhatsApp) return;

    const mensaje = `Hola Casa Alvarado, me interesa el producto: ${producto.modelo} - Marca: ${producto.marca}`;
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(mensaje)}`;
    
    // Remover event listeners previos
    const newBtn = btnWhatsApp.cloneNode(true);
    btnWhatsApp.parentNode.replaceChild(newBtn, btnWhatsApp);
    
    newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(urlWhatsApp, '_blank');
    });
}

// ========== CARGAR PRODUCTOS SIMILARES ==========
async function cargarProductosSimilares(modelo) {
    const contenedor = document.getElementById("productos-similares");
    if (!contenedor) return;
    
    contenedor.innerHTML = '<div class="loading">🔄 Cargando productos similares...</div>';

    try {
        const url = `${API_BASE}/productos-similares/${modelo}`;
        console.log('Fetching similares:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Error al cargar productos similares');
        
        const productos = await response.json();
        console.log('Similares cargados:', productos);
        
        contenedor.innerHTML = "";
        
        if (productos.length === 0) {
            contenedor.innerHTML = '<div class="mensaje-vacio">⚠️ No hay productos similares disponibles</div>';
            return;
        }
        
        const estrellasHTML = (calificacion) => {
            const estrellas = Math.round(calificacion || 0);
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                const caracter = i <= estrellas ? '★' : '☆';
                stars += `<span style="color: #ffc107;">${caracter}</span>`;
            }
            return stars;
        };
        
        productos.forEach(producto => {
            contenedor.innerHTML += `
                <div class="tarjeta_producto">
                    <img src="${producto.imagen || 'https://via.placeholder.com/300x220?text=Sin+imagen'}" 
                         alt="${producto.modelo}" 
                         onerror="this.src='https://via.placeholder.com/300x220?text=Sin+imagen'">
                    <h3>${producto.modelo}</h3>
                    <p class="marca-producto">${producto.marca || ''}</p>
                    <div class="rating">
                        <span class="rating-number">${producto.estrellas || 0}</span>
                        <span class="rating-stars">${estrellasHTML(producto.estrellas)}</span>
                    </div>
                    <a href="producto.html?modelo=${encodeURIComponent(producto.modelo)}" class="boton_producto">Ver más</a>
                </div>
            `;
        });
        
    } catch(error) {
        console.error('Error cargando similares:', error);
        contenedor.innerHTML = '<div class="error-mensaje">❌ Error al cargar productos similares</div>';
    }
}

// ========== MOSTRAR ERROR ==========
function mostrarError(mensaje) {
    const productoInfo = document.querySelector('.producto_info');
    if (productoInfo) {
        productoInfo.innerHTML = `
            <div class="error-mensaje" style="text-align: center; padding: 2rem;">
                <h3>⚠️ Error</h3>
                <p>${mensaje}</p>
                <a href="catalogo.html" class="btn btn_volver" style="margin-top: 1rem; display: inline-block;">← Volver al catálogo</a>
            </div>
        `;
    }
}

// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', () => {
    cargarProducto();
});