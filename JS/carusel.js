const track = document.getElementById('track');
const items = Array.from(track.children);
const itemWidth = 280; // Ancho total (item + margen)
const totalOriginales = items.length;

// 1. Clonamos para ambos lados
// Clones al final
items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
});
// Clones al inicio (en orden inverso para que queden bien)
items.reverse().forEach(item => {
    const clone = item.cloneNode(true);
    track.prepend(clone);
});

// 2. Posicionamos el carrusel en los elementos originales (saltando los clones iniciales)
let posicion = -(itemWidth * totalOriginales);
track.style.transform = `translateX(${posicion}px)`;

let isMoving = false;

function moverCarrusel(direccion) {
    if (isMoving) return;
    isMoving = true;

    track.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    posicion -= direccion * itemWidth;
    track.style.transform = `translateX(${posicion}px)`;

    // Revisar saltos al terminar la animación
    setTimeout(() => {
        // SALTO AL FINAL: Si llegamos al final de los clones derechos
        if (Math.abs(posicion) >= itemWidth * (totalOriginales * 2)) {
            track.style.transition = "none";
            posicion = -(itemWidth * totalOriginales);
            track.style.transform = `translateX(${posicion}px)`;
        }
        
        // SALTO AL INICIO: Si retrocedemos más allá de los originales
        if (Math.abs(posicion) <= itemWidth * (totalOriginales - 1) && direccion === -1) {
            track.style.transition = "none";
            posicion = -(itemWidth * (totalOriginales * 2 - 1));
            track.style.transform = `translateX(${posicion}px)`;
        }
        
        isMoving = false;
    }, 500);
}
// Variables para rastrear el toque
let touchStartX = 0;
let touchEndX = 0;

const carruselContenedor = document.querySelector('.carrusel-contenedor');

// Detectar cuando el dedo toca la pantalla
carruselContenedor.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

// Detectar cuando el dedo se levanta de la pantalla
carruselContenedor.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleGesture();
}, { passive: true });

// Lógica para decidir si fue un deslizamiento a izquierda o derecha
function handleGesture() {
    const umbral = 50; // Distancia mínima en píxeles para que cuente como swipe
    
    if (touchEndX < touchStartX - umbral) {
        // Deslizó a la izquierda -> Siguiente
        moverCarrusel(1);
    }
    
    if (touchEndX > touchStartX + umbral) {
        // Deslizó a la derecha -> Anterior
        moverCarrusel(-1);
    }
}
