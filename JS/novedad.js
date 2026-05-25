// NO declarar API_BASE aquí - usar la variable global de config.js
// Solo asegurarse de que existe

// ========== CARGAR PRODUCTOS NOVEDAD ==========
async function cargarNovedades() {

    const contenedor =
        document.getElementById('productos-novedad');

    if (!contenedor) return;

    contenedor.innerHTML =
        '<div class="loading">🔄 Cargando novedades...</div>';

    try {

        // Usar la variable global de config.js
        const API_BASE = window.API_BASE || 'https://casaalvarado-production.up.railway.app';

        const response = await fetch(
            `${API_BASE}/productos/novedades`
        );

        if (!response.ok) {
            throw new Error(
                'Error al cargar novedades'
            );
        }

        const productos = await response.json();

        if (!productos.length) {

            contenedor.innerHTML = `
                <div class="mensaje-vacio">
                    ⚠️ No hay productos en novedad
                </div>
            `;

            return;
        }

        const estrellasHTML = (calificacion) => {

            const estrellas =
                Math.round(calificacion || 0);

            let stars = '';

            const colorEstrella =
                estrellas > 0
                    ? '#ffc107'
                    : '#ccc';

            for (let i = 1; i <= 5; i++) {

                const caracter =
                    i <= estrellas
                        ? '★'
                        : '☆';

                stars += `
                    <span style="color:${colorEstrella};">
                        ${caracter}
                    </span>
                `;
            }

            return stars;
        };

        contenedor.innerHTML = productos.map(producto => `
            <div class="tarjeta_producto">

                <img
                    src="${producto.imagen}"
                    alt="${producto.modelo}"
                    onerror="this.src='https://via.placeholder.com/300x220?text=Sin+imagen'"
                >

                <h3>${producto.modelo}</h3>

                <p class="marca-producto">
                    ${producto.marca}
                </p>

                <div class="rating">

                    <span class="rating-number">
                        ${producto.estrellas || 0}
                    </span>

                    <span class="rating-stars">
                        ${estrellasHTML(producto.estrellas)}
                    </span>

                </div>

                <a
                    href="/Paginas/producto.html?modelo=${encodeURIComponent(producto.modelo)}"
                    class="boton_producto"
                >
                    Ver más
                </a>

            </div>
        `).join('');

    } catch (error) {

        console.error(
            'Error cargando novedades:',
            error
        );

        contenedor.innerHTML = `
            <div class="error-mensaje">
                ❌ Error al cargar novedades
            </div>
        `;
    }
}

// ========== INICIALIZAR ==========
document.addEventListener(
    'DOMContentLoaded',
    cargarNovedades
);