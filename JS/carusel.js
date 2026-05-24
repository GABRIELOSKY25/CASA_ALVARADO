const API_BASE = "http://127.0.0.1:8000";
const track = document.getElementById('track');

let posicion = 0;
let isMoving = false;
let itemWidth = 280;
let totalOriginales = 0;

// ========================================
// CARGAR MARCAS POR CATEGORIA Y PRIORIDAD
// ========================================

async function cargarCarruselMarcas() {

    try {

        // Obtener categoria desde la URL
        const params = new URLSearchParams(window.location.search);

        const categoria = params.get("categoria");

        console.log("Categoria enviada:", categoria);

        // Endpoint conectado con FastAPI
        const response = await fetch(
            `${API_BASE}/marcas/carrusel`
        );

        const marcas = await response.json();

        console.log("Marcas recibidas:", marcas);

        // Limpiar track
        track.innerHTML = "";

        // Crear HTML
        track.innerHTML = marcas.map(marca => `
            <div
                class="carrusel-item"
                data-nombre="${marca.nombre}"
            >
                <img
                    src="${marca.imagen}"
                    alt="${marca.nombre}"
                >
            </div>
        `).join('');
        console.log(track.innerHTML);    
        // Inicializar slider infinito
        inicializarCarrusel();

    } catch (error) {

        console.error('Error cargando marcas:', error);
    }
}

// ========================================
// INICIALIZAR CARRUSEL
// ========================================

function inicializarCarrusel() {

    const items = Array.from(track.children);

    totalOriginales = items.length;

    // Clones al final
    items.forEach(item => {

        const clone = item.cloneNode(true);

        track.appendChild(clone);
    });

    // Clones al inicio
    [...items].reverse().forEach(item => {

        const clone = item.cloneNode(true);

        track.prepend(clone);
    });

    // Posición inicial
    posicion = -(itemWidth * totalOriginales);

    track.style.transition = "none";

    track.style.transform = `translateX(${posicion}px)`;
}

// ========================================
// MOVER CARRUSEL
// ========================================

function moverCarrusel(direccion) {

    if (isMoving) return;

    isMoving = true;

    track.style.transition =
        "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    posicion -= direccion * itemWidth;

    track.style.transform = `translateX(${posicion}px)`;

    setTimeout(() => {

        // Salto al final
        if (
            Math.abs(posicion) >=
            itemWidth * (totalOriginales * 2)
        ) {

            track.style.transition = "none";

            posicion = -(itemWidth * totalOriginales);

            track.style.transform = `translateX(${posicion}px)`;
        }

        // Salto al inicio
        if (
            Math.abs(posicion) <=
            itemWidth * (totalOriginales - 1) &&
            direccion === -1
        ) {

            track.style.transition = "none";

            posicion = -(itemWidth * (totalOriginales * 2 - 1));

            track.style.transform = `translateX(${posicion}px)`;
        }

        isMoving = false;

    }, 500);
}

// ========================================
// DESLIZAMIENTO TÁCTIL
// ========================================

let touchStartX = 0;
let touchEndX = 0;

const carruselContenedor =
    document.querySelector('.carrusel-contenedor');

// Inicio del toque
carruselContenedor.addEventListener(
    'touchstart',
    e => {

        touchStartX = e.changedTouches[0].screenX;

    },
    { passive: true }
);

// Final del toque
carruselContenedor.addEventListener(
    'touchend',
    e => {

        touchEndX = e.changedTouches[0].screenX;

        handleGesture();

    },
    { passive: true }
);

// Detectar dirección
function handleGesture() {

    const umbral = 50;

    // Swipe izquierda
    if (touchEndX < touchStartX - umbral) {

        moverCarrusel(1);
    }

    // Swipe derecha
    if (touchEndX > touchStartX + umbral) {

        moverCarrusel(-1);
    }
}

// ========================================
// INICIAR
// ========================================

cargarCarruselMarcas();