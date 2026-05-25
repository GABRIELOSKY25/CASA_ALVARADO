// API Base URL - CORREGIDO para Railway
const API_BASE = window.API_BASE || 'https://casaalvarado-production.up.railway.app';

// Número de WhatsApp de la tienda
const WHATSAPP_NUMBER = "529611543145";

// Variables para calificación
let calificacionSeleccionada = 0;

// Obtener modelo de producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const modeloProducto = urlParams.get('modelo');

// ========== FUNCIONES PARA PRESERVAR FILTROS ==========
function obtenerParametrosCatalogo() {
    // Intentar obtener de sessionStorage (se limpia al cerrar la pestaña)
    const paramsGuardados = sessionStorage.getItem('catalogo_params');
    if (paramsGuardados) {
        return JSON.parse(paramsGuardados);
    }
    
    // Si no hay guardados, intentar obtener de la URL de referencia
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
        sessionStorage.setItem('catalogo_params', JSON.stringify({ familia, categoria }));
    }
}

function getUrlCatalogoConFiltros() {
    const params = obtenerParametrosCatalogo();
    let urlCatalogo = '/Paginas/catalogo.html';
    
    if (params.familia && params.categoria) {
        urlCatalogo = `/Paginas/catalogo.html?familia=${encodeURIComponent(params.familia)}&categoria=${encodeURIComponent(params.categoria)}`;
    } else if (params.familia) {
        urlCatalogo = `/Paginas/catalogo.html?familia=${encodeURIComponent(params.familia)}`;
    } else if (params.categoria) {
        urlCatalogo = `/Paginas/catalogo.html?categoria=${encodeURIComponent(params.categoria)}`;
    }
    
    return urlCatalogo;
}

console.log('API_BASE:', API_BASE);
console.log('Modelo producto:', modeloProducto);

// ========== CARGAR PRODUCTO PRINCIPAL ==========
async function cargarProducto() {
    if (!modeloProducto) {
        console.error('No se especificó modelo de producto');
        alert("No se especificó producto");
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

        // ========= CALIFICACIÓN PROMEDIO =========
        const estrellas = Number(producto.estrellas || 0);
        const ratingNumElement = document.getElementById('rating-num');
        if (ratingNumElement) {
            ratingNumElement.textContent = `${estrellas} / 5`;
        }
        mostrarEstrellasPromedio(estrellas);

        // ========= VERIFICAR SESIÓN PARA CALIFICAR =========
        const usuario = localStorage.getItem("usuario");
        const calificacionDiv = document.getElementById("calificacionUsuario");
        
        if (usuario && calificacionDiv) {
            calificacionDiv.style.display = "block";
            const userData = JSON.parse(usuario);
            await verificarCalificacionExistente(modeloProducto, userData.correo);
            inicializarEstrellasCalificacion();
            
            const btnEnviar = document.getElementById("btnEnviarCalificacion");
            if (btnEnviar) {
                btnEnviar.onclick = () => enviarCalificacion(modeloProducto, userData.correo);
            }
        }

        // ========= WHATSAPP =========
        configurarWhatsApp(producto);

        // ========= PRODUCTOS SIMILARES =========
        await cargarProductosSimilares(producto.modelo);

    } catch (error) {
        console.error('Error cargando producto:', error);
        mostrarError('No se pudo cargar el producto: ' + error.message);
    }
}

// ========== MOSTRAR ESTRELLAS PROMEDIO ==========
function mostrarEstrellasPromedio(calificacion) {
    const container = document.getElementById("rating-stars-display");
    if (!container) return;
    
    container.innerHTML = "";
    const estrellas = Math.round(calificacion || 0);
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = i <= estrellas ? "★" : "☆";
        star.style.color = "#ffc107";
        star.style.fontSize = "1.3rem";
        star.style.marginRight = "3px";
        container.appendChild(star);
    }
}

// ========== INICIALIZAR ESTRELLAS DE CALIFICACIÓN ==========
function inicializarEstrellasCalificacion() {
    const estrellas = document.querySelectorAll("#estrellasCalificacion i");
    if (!estrellas.length) return;
    
    estrellas.forEach(estrella => {
        estrella.onmouseenter = () => {
            const valor = parseInt(estrella.getAttribute("data-valor"));
            resaltarEstrellas(valor);
        };
        
        estrella.onmouseleave = () => {
            resaltarEstrellas(calificacionSeleccionada);
        };
        
        estrella.onclick = () => {
            calificacionSeleccionada = parseInt(estrella.getAttribute("data-valor"));
            resaltarEstrellas(calificacionSeleccionada);
        };
    });
}

function resaltarEstrellas(valor) {
    const estrellas = document.querySelectorAll("#estrellasCalificacion i");
    estrellas.forEach((estrella, index) => {
        if (index < valor) {
            estrella.className = "fas fa-star";
            estrella.style.color = "#ffc107";
        } else {
            estrella.className = "far fa-star";
            estrella.style.color = "#ccc";
        }
    });
}

// ========== VERIFICAR SI EL USUARIO YA CALIFICÓ ==========
async function verificarCalificacionExistente(modelo, correo) {
    try {
        const url = `${API_BASE}/calificacion/usuario/${correo}/${modelo}`;
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            if (data.calificacion) {
                calificacionSeleccionada = data.calificacion;
                resaltarEstrellas(calificacionSeleccionada);
                const mensaje = document.getElementById("mensajeCalificacion");
                if (mensaje) {
                    mensaje.textContent = "Ya calificaste este producto. Puedes actualizar tu calificación.";
                    mensaje.style.color = "#003b6f";
                }
            }
        }
    } catch (error) {
        console.log("No hay calificación previa o error:", error);
    }
}

// ========== ENVIAR CALIFICACIÓN ==========
async function enviarCalificacion(modelo, correo) {
    if (calificacionSeleccionada === 0) {
        const mensaje = document.getElementById("mensajeCalificacion");
        if (mensaje) {
            mensaje.textContent = "Selecciona una calificación";
            mensaje.style.color = "red";
        }
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/calificacion`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                modelo: modelo,
                correo: correo,
                estrellas: calificacionSeleccionada,
                fecha: new Date().toISOString().split("T")[0]
            })
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            const mensaje = document.getElementById("mensajeCalificacion");
            if (mensaje) {
                mensaje.textContent = "¡Gracias por tu calificación!";
                mensaje.style.color = "green";
            }
            // Actualizar promedio mostrado
            mostrarEstrellasPromedio(resultado.nuevoPromedio);
            const ratingNumElement = document.getElementById("rating-num");
            if (ratingNumElement) {
                ratingNumElement.textContent = `${resultado.nuevoPromedio || 0} / 5`;
            }
        } else {
            const mensaje = document.getElementById("mensajeCalificacion");
            if (mensaje) {
                mensaje.textContent = resultado.detail || "Error al calificar";
                mensaje.style.color = "red";
            }
        }
    } catch (error) {
        console.error("Error:", error);
        const mensaje = document.getElementById("mensajeCalificacion");
        if (mensaje) {
            mensaje.textContent = "Error de conexión";
            mensaje.style.color = "red";
        }
    }
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
        
        // Obtener parámetros para los enlaces
        const params = obtenerParametrosCatalogo();
        
        productos.forEach(producto => {
            let urlProducto = `producto.html?modelo=${encodeURIComponent(producto.modelo)}`;
            if (params.familia) urlProducto += `&familia=${encodeURIComponent(params.familia)}`;
            if (params.categoria) urlProducto += `&categoria=${encodeURIComponent(params.categoria)}`;
            
            contenedor.innerHTML += `
                <div class="tarjeta_producto">
                    <img src="${producto.imagen || 'https://via.placeholder.com/300x220?text=Sin+imagen'}" 
                         alt="${producto.modelo}" 
                         onerror="this.src='https://via.placeholder.com/300x220?text=Sin+imagen'">
                    <h3>${producto.modelo}</h3>
                    <p class="marca-producto">${producto.marca || ''}</p>
                    <div class="rating">
                        <span class="rating-number">${producto.estrellas || 0}</span>
                        <span class="rating-stars">${generarEstrellasSimples(producto.estrellas)}</span>
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

function generarEstrellasSimples(calificacion) {
    const estrellas = Math.round(calificacion || 0);
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<span style="color: #ffc107;">${i <= estrellas ? '★' : '☆'}</span>`;
    }
    return stars;
}

// ========== MOSTRAR ERROR ==========
function mostrarError(mensaje) {
    const productoInfo = document.querySelector('.producto_info');
    if (productoInfo) {
        const urlCatalogo = getUrlCatalogoConFiltros();
        
        productoInfo.innerHTML = `
            <div class="error-mensaje" style="text-align: center; padding: 2rem;">
                <h3>⚠️ Error</h3>
                <p>${mensaje}</p>
                <a href="${urlCatalogo}" class="btn btn_verde" style="margin-top: 1rem; display: inline-block;">← Volver al catálogo</a>
            </div>
        `;
    }
}
// ========== INICIALIZAR ==========
document.addEventListener('DOMContentLoaded', () => {
    cargarProducto();
});