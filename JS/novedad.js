// novedad.js
async function cargarNovedades() {
    const contenedor = document.getElementById('productos-novedad');
    if (!contenedor) return;

    contenedor.innerHTML = '<div class="loading">🔄 Cargando novedades...</div>';

    try {
        const API_BASE = window.API_BASE || 'https://casaalvarado-production.up.railway.app';
        
        // Verificar que la respuesta es JSON
        const response = await fetch(`${API_BASE}/productos/novedades`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Verificar el Content-Type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('La respuesta no es JSON');
        }
        
        const productos = await response.json();
        console.log('Productos recibidos:', productos);

        if (!productos || !productos.length) {
            contenedor.innerHTML = `<div class="mensaje-vacio">⚠️ No hay productos en novedad</div>`;
            return;
        }

        const estrellasHTML = (calificacion) => {
            const estrellas = Math.round(calificacion || 0);
            let stars = '';
            for (let i = 1; i <= 5; i++) {
                const caracter = i <= estrellas ? '★' : '☆';
                stars += `<span style="color:#ffc107;">${caracter}</span>`;
            }
            return stars;
        };

        contenedor.innerHTML = productos.map(producto => `
            <div class="tarjeta_producto">
                <img src="${producto.imagen || 'https://via.placeholder.com/300x220?text=Sin+imagen'}" 
                     alt="${producto.modelo}"
                     onerror="this.src='https://via.placeholder.com/300x220?text=Sin+imagen'">
                <h3>${producto.modelo}</h3>
                <p class="marca-producto">${producto.marca}</p>
                <div class="rating">
                    <span class="rating-number">${producto.estrellas || 0}</span>
                    <span class="rating-stars">${estrellasHTML(producto.estrellas)}</span>
                </div>
                <a href="/Paginas/producto.html?modelo=${encodeURIComponent(producto.modelo)}" 
                   class="boton_producto">Ver más</a>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error cargando novedades:', error);
        contenedor.innerHTML = `<div class="error-mensaje">❌ Error al cargar novedades: ${error.message}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', cargarNovedades);