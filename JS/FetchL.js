const BASE_URL = "https://casaalvarado-production.up.railway.app";

// Verificar si ya hay sesión iniciada al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        mostrarInfoUsuario(usuario);
        mostrarBotonAdmin(usuario);  // ← Mostrar botón si es admin
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
                telefono: resultado.telefono,
                rol: resultado.rol || 'Usuario'
            }));
            
            // Mostrar información del usuario
            mostrarInfoUsuario({
                nombre: resultado.nombre,
                apellido: resultado.apellido,
                correo: resultado.correo,
                telefono: resultado.telefono,
                rol: resultado.rol || 'Usuario'
            });
            
            // Mostrar botón de admin si corresponde
            mostrarBotonAdmin({ rol: resultado.rol || 'Usuario' });
            
            alert(`¡Bienvenido ${resultado.nombre} ${resultado.apellido}!`);
            
        } else {
            alert(resultado.detail || "Error al iniciar sesión");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor");
    }
});

// Función para mostrar el botón de administrador
function mostrarBotonAdmin(usuario) {
    const btnAdmin = document.getElementById('btnAdministrar');
    if (btnAdmin) {
        // Comparar con 'admin' (minúsculas)
        if (usuario.rol && usuario.rol.toLowerCase() === 'admin') {
            btnAdmin.style.display = 'flex';
        } else {
            btnAdmin.style.display = 'none';
        }
    }
}

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
    });
}