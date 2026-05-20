// include.js
async function cargarComponente(id, ruta) {
    try {
        const res = await fetch(ruta);
        const html = await res.text();
        const contenedor = document.getElementById(id);
        if (contenedor) {
            contenedor.innerHTML = html;
        }
    } catch (error) {
        console.error("Error cargando componente:", error);
    }
}

// ========== MANEJO DE SESIÓN EN EL HEADER ==========
function actualizarHeaderPorSesion() {
    const usuario = localStorage.getItem("usuario");
    const authNavItem = document.getElementById("authNavItem");
    const authLink = document.getElementById("authLink");
    
    if (!authNavItem || !authLink) return;
    
    if (usuario) {
        const userData = JSON.parse(usuario);
        // Cambiar el enlace por el nombre del usuario
        authLink.innerHTML = `
            <i class="fas fa-user-circle"></i> 
            ${userData.nombre.split(' ')[0]} ${userData.apellido.split(' ')[0]}
        `;
        authLink.href = "#";
        authLink.classList.add("auth-user");
        
        // Agregar menú desplegable al hacer clic
        authLink.onclick = (e) => {
            e.preventDefault();
            mostrarMenuUsuario();
        };
    } else {
        // Mostrar "INICIAR SESION" normalmente
        authLink.innerHTML = "INICIAR SESION";
        authLink.href = "/PAGINAS/login.html";
        authLink.classList.remove("auth-user");
        authLink.onclick = null;
    }
}

// Mostrar menú de usuario
function mostrarMenuUsuario() {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) return;
    
    const userData = JSON.parse(usuario);
    const authLink = document.getElementById("authLink");
    
    // Cerrar menú si ya existe
    const menuExistente = document.getElementById("userMenuModal");
    if (menuExistente) {
        menuExistente.remove();
        return;
    }
    
    const menu = document.createElement("div");
    menu.id = "userMenuModal";
    menu.className = "user-menu-modal";
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-menu-header">
                <div>
                    <h4>${userData.nombre} ${userData.apellido}</h4>
                    <p>${userData.correo}</p>
                </div>
            </div>
            <div class="user-menu-options">
                <a href="/PAGINAS/login.html">
                    <i class="fas fa-id-card"></i> Mi Cuenta
                </a>
                <button onclick="cerrarSesionGlobal()">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Cerrar al hacer clic fuera
    setTimeout(() => {
        document.addEventListener("click", function cerrarMenu(e) {
            if (!menu.contains(e.target) && e.target !== authLink) {
                menu.remove();
                document.removeEventListener("click", cerrarMenu);
            }
        });
    }, 100);
}

// Cerrar sesión globalmente
function cerrarSesionGlobal() {
    localStorage.removeItem("usuario");
    window.location.href = "/index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Cargamos los componentes
    await cargarComponente("header", "/components/header.html");
    await cargarComponente("footer", "/components/footer.html");

    // 2. Una vez cargados, actualizamos el header con la sesión
    actualizarHeaderPorSesion();

    // 3. Avisamos que ya están listos
    document.dispatchEvent(new Event("componentesCargados"));
});