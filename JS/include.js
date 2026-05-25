// include.js
async function cargarComponente(id, ruta) {
    try {
        const res = await fetch(ruta);
        const html = await res.text();
        const contenedor = document.getElementById(id);
        if (contenedor) {
            contenedor.innerHTML = html;
        }
        return true;
    } catch (error) {
        console.error("Error cargando componente:", error);
        return false;
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
        authLink.innerHTML = `
            <i class="fas fa-user-circle"></i> 
            ${userData.nombre.split(' ')[0]} ${userData.apellido.split(' ')[0]}
        `;
        authLink.href = "#";
        authLink.classList.add("auth-user");
        
        authLink.onclick = (e) => {
            e.preventDefault();
            mostrarMenuUsuario();
        };
    } else {
        authLink.innerHTML = "INICIAR SESION";
        authLink.href = "/Paginas/login.html";
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
                <a href="/Paginas/login.html">
                    <i class="fas fa-id-card"></i> Mi Cuenta
                </a>
                <button onclick="cerrarSesionGlobal()">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    setTimeout(() => {
        document.addEventListener("click", function cerrarMenu(e) {
            if (!menu.contains(e.target) && e.target !== authLink) {
                menu.remove();
                document.removeEventListener("click", cerrarMenu);
            }
        });
    }, 100);
}

function cerrarSesionGlobal() {
    localStorage.removeItem("usuario");
    window.location.href = "/index.html";
}

// ========== MENÚ HAMBURGUESA ==========
function inicializarMenuHamburguesa() {
    const hamburguesaBtn = document.getElementById("hamburguesaBtn");
    const nav = document.querySelector("nav");
    
    if (hamburguesaBtn && nav) {
        hamburguesaBtn.addEventListener("click", function() {
            this.classList.toggle("activo");
            nav.classList.toggle("activo");
        });
        
        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburguesaBtn.classList.remove("activo");
                nav.classList.remove("activo");
            });
        });
        console.log("Menú hamburguesa inicializado");
    } else {
        console.log("No se encontraron los elementos del menú hamburguesa");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Cargamos los componentes
    await cargarComponente("header", "/components/header.html");
    await cargarComponente("footer", "/components/footer.html");

    // 2. Una vez cargados, actualizamos el header con la sesión
    actualizarHeaderPorSesion();
    
    // 3. Inicializar menú hamburguesa DESPUÉS de que el header esté cargado
    inicializarMenuHamburguesa();

    // 4. Avisamos que ya están listos
    document.dispatchEvent(new Event("componentesCargados"));
});