const BASE_URL = "http://127.0.0.1:8000";

// Verificar si ya hay sesión iniciada al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        mostrarInfoUsuario(usuario);
    }
});

// Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const datos = {
        correo: document.getElementById("loginCorreo").value,
        contrasena: document.getElementById("loginContrasena").value
    };
    
    try {
        const respuesta = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await respuesta.json();
        
        if (respuesta.ok) {
            // Guardar usuario en localStorage
            localStorage.setItem("usuario", JSON.stringify({
                nombre: resultado.nombre,
                apellido: resultado.apellido,
                correo: resultado.correo,
                telefono: resultado.telefono
            }));
            
            // Mostrar información del usuario
            mostrarInfoUsuario({
                nombre: resultado.nombre,
                apellido: resultado.apellido,
                correo: resultado.correo,
                telefono: resultado.telefono
            });
            
            // Redirigir al index después de 1 segundo
            window.location.href = "login.html";
        } else {
            alert(resultado.detail || "Error al iniciar sesión");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor");
    }
});

// Función para mostrar la información del usuario y ocultar el formulario
function mostrarInfoUsuario(usuario) {
    // Ocultar el formulario de login
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        authForm.style.display = 'none';
    }
    
    // Mostrar la tarjeta de información del usuario
    const userInfoCard = document.getElementById('userInfoCard');
    if (userInfoCard) {
        userInfoCard.style.display = 'block';
        userInfoCard.style.flex = '1';
        userInfoCard.style.padding = '40px';
    }
    
    // Llenar los datos del usuario
    const nombreCompleto = document.getElementById('userNombreCompleto');
    const correoInfo = document.getElementById('userCorreoInfo');
    const telefonoInfo = document.getElementById('userTelefonoInfo');
    
    if (nombreCompleto) nombreCompleto.textContent = `${usuario.nombre} ${usuario.apellido}`;
    if (correoInfo) correoInfo.textContent = usuario.correo;
    if (telefonoInfo) telefonoInfo.textContent = usuario.telefono;
}

// Cerrar sesión
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
        // Eliminar usuario del localStorage
        localStorage.removeItem('usuario');
        
        // Mostrar formulario de login
        const authForm = document.querySelector('.auth-form');
        if (authForm) {
            authForm.style.display = 'block';
        }
        
        // Ocultar tarjeta de usuario
        const userInfoCard = document.getElementById('userInfoCard');
        if (userInfoCard) {
            userInfoCard.style.display = 'none';
        }
        
        // Limpiar el formulario
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
        
        alert('Has cerrado sesión correctamente');
        
        // Redirigir al index
        window.location.href = "login.html";
    });
}
