async function cargarProducto() {
    const params = new URLSearchParams(window.location.search);
    const modelo = params.get("modelo");

    if (!modelo) {
        alert("No se especificó producto");
        return;
    }

    try {
        const response = await fetch(`https://casaalvarado-production.up.railway.app/producto/${modelo}`);

        if (!response.ok) {
            throw new Error("Error HTTP: " + response.status);
        }

        const producto = await response.json();

        document.getElementById("producto-img").src = producto.imagen;
        document.getElementById("producto-marca").textContent = producto.marca;
        document.getElementById("producto-modelo").textContent = producto.modelo;
        document.getElementById("producto-descripcion").textContent = producto.descripcion;

        // Mostrar estrellas promedio
        mostrarEstrellasPromedio(producto.estrellas);
        document.getElementById("rating-num").textContent = `${producto.estrellas || 0} / 5`;

        // Verificar si el usuario está logueado para mostrar calificación
        const usuario = localStorage.getItem("usuario");
        const calificacionDiv = document.getElementById("calificacionUsuario");
        
        if (usuario && calificacionDiv) {
            calificacionDiv.style.display = "block";
            const userData = JSON.parse(usuario);
            await verificarCalificacionExistente(modelo, userData.correo);
            inicializarEstrellasCalificacion();
            
            const btnEnviar = document.getElementById("btnEnviarCalificacion");
            if (btnEnviar) {
                btnEnviar.onclick = () => enviarCalificacion(modelo, userData.correo);
            }
        }
        
    } catch (error) {
        console.error(error);
        alert("Error cargando producto");
    }
}

// Mostrar estrellas promedio
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

// Variables para calificación
let calificacionSeleccionada = 0;

// Inicializar estrellas de calificación
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

// Verificar si el usuario ya calificó
async function verificarCalificacionExistente(modelo, correo) {
    try {
        const response = await fetch(`https://casaalvarado-production.up.railway.app/calificacion/usuario/${correo}/${modelo}`);
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
        console.log("No hay calificación previa");
    }
}

// Enviar calificación
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
        const response = await fetch("https://casaalvarado-production.up.railway.app/calificacion", {
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
            document.getElementById("rating-num").textContent = `${resultado.nuevoPromedio || 0} / 5`;
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

// Inicializar
cargarProducto();