// ========== SISTEMA DE CALIFICACIÓN ==========
const API_BASE = "https://casaalvarado-production.up.railway.app";

let calificacionSeleccionada = 0;
let productoActual = null;

// Inicializar estrellas de calificación
function inicializarEstrellasCalificacion() {
    const estrellas = document.querySelectorAll('#estrellasCalificacion i');
    if (!estrellas.length) return;
    
    estrellas.forEach(estrella => {
        estrella.addEventListener('mouseenter', () => {
            const valor = parseInt(estrella.getAttribute('data-valor'));
            resaltarEstrellas(valor);
        });
        
        estrella.addEventListener('mouseleave', () => {
            resaltarEstrellas(calificacionSeleccionada);
        });
        
        estrella.addEventListener('click', () => {
            calificacionSeleccionada = parseInt(estrella.getAttribute('data-valor'));
            resaltarEstrellas(calificacionSeleccionada);
        });
    });
}

function resaltarEstrellas(valor) {
    const estrellas = document.querySelectorAll('#estrellasCalificacion i');
    estrellas.forEach((estrella, index) => {
        if (index < valor) {
            estrella.className = 'fas fa-star';
            estrella.style.color = '#ffc107';
        } else {
            estrella.className = 'far fa-star';
            estrella.style.color = '#ccc';
        }
    });
}

// Mostrar estrellas promedio del producto
function mostrarEstrellasPromedio(calificacion) {
    const container = document.getElementById('rating-stars-display');
    if (!container) return;
    
    container.innerHTML = '';
    const estrellas = Math.round(calificacion || 0);
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.textContent = i <= estrellas ? '★' : '☆';
        star.style.color = '#ffc107';
        star.style.fontSize = '1.3rem';
        star.style.marginRight = '3px';
        container.appendChild(star);
    }
    
    const ratingNum = document.getElementById('rating-num');
    if (ratingNum) {
        ratingNum.textContent = `${calificacion || 0} / 5`;
    }
}

// Verificar si el usuario ya calificó este producto
async function verificarCalificacionExistente(modelo, correo) {
    try {
        const response = await fetch(`${API_BASE}/calificacion/usuario/${correo}/${modelo}`);
        if (response.ok) {
            const data = await response.json();
            if (data.calificacion) {
                calificacionSeleccionada = data.calificacion;
                resaltarEstrellas(calificacionSeleccionada);
                const mensaje = document.getElementById('mensajeCalificacion');
                if (mensaje) {
                    mensaje.textContent = 'Ya calificaste este producto. Puedes actualizar tu calificación.';
                    mensaje.style.color = '#003b6f';
                }
            }
        }
    } catch (error) {
        console.log('No hay calificación previa');
    }
}

// Enviar calificación
async function enviarCalificacion(modelo, correo, estrellas) {
    try {
        const response = await fetch(`${API_BASE}/calificacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                modelo: modelo,
                correo: correo,
                estrellas: estrellas,
                fecha: new Date().toISOString().split('T')[0]
            })
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            const mensaje = document.getElementById('mensajeCalificacion');
            if (mensaje) {
                mensaje.textContent = '¡Gracias por tu calificación!';
                mensaje.style.color = 'green';
            }
            // Actualizar promedio mostrado
            mostrarEstrellasPromedio(resultado.nuevoPromedio);
            return true;
        } else {
            const mensaje = document.getElementById('mensajeCalificacion');
            if (mensaje) {
                mensaje.textContent = resultado.detail || 'Error al calificar';
                mensaje.style.color = 'red';
            }
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        const mensaje = document.getElementById('mensajeCalificacion');
        if (mensaje) {
            mensaje.textContent = 'Error de conexión';
            mensaje.style.color = 'red';
        }
        return false;
    }
}

// Inicializar calificación en página de producto
function inicializarCalificacion() {
    const usuario = localStorage.getItem('usuario');
    const calificacionDiv = document.getElementById('calificacionUsuario');
    
    if (usuario && calificacionDiv) {
        calificacionDiv.style.display = 'block';
        inicializarEstrellasCalificacion();
        
        const modelo = new URLSearchParams(window.location.search).get('modelo');
        if (modelo) {
            const userData = JSON.parse(usuario);
            verificarCalificacionExistente(modelo, userData.correo);
            
            const btnEnviar = document.getElementById('btnEnviarCalificacion');
            if (btnEnviar) {
                btnEnviar.addEventListener('click', () => {
                    if (calificacionSeleccionada === 0) {
                        const mensaje = document.getElementById('mensajeCalificacion');
                        if (mensaje) {
                            mensaje.textContent = 'Selecciona una calificación';
                            mensaje.style.color = 'red';
                        }
                        return;
                    }
                    enviarCalificacion(modelo, userData.correo, calificacionSeleccionada);
                });
            }
        }
    }
}

// Exportar funciones si es necesario
window.mostrarEstrellasPromedio = mostrarEstrellasPromedio;
window.inicializarCalificacion = inicializarCalificacion;