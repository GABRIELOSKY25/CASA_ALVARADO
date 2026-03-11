// === MEGAMENÚ CATÁLOGO ===
document.addEventListener('DOMContentLoaded', function () {

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    document.body.appendChild(overlay);

    // Crear megamenú
    const megamenu = document.createElement('div');
    megamenu.classList.add('megamenu');
    megamenu.innerHTML = `
        <div class="megamenu-contenido">
            <div class="categorias-grid">

                <!-- Audio -->
                <div class="categoria-grupo">
                    <div class="categoria-titulo">Audio</div>
                    <ul class="categoria-lista">
                        <li><a href="Paginas/catalogo.php?cat=bafles">Bafles</a></li>
                        <li><a href="Paginas/catalogo.php?cat=mezcladora">Mezcladora</a></li>
                        <li><a href="Paginas/catalogo.php?cat=bocina">Bocina</a></li>
                        <li><a href="Paginas/catalogo.php?cat=microfonos">Micrófonos</a></li>
                    </ul>
                </div>

                <!-- Instrumentos -->
                <div class="categoria-grupo">
                    <div class="categoria-titulo">Instrumentos</div>
                    <ul class="categoria-lista">
                        <li class="tiene-hijos"><a href="Paginas/catalogo.php?cat=cuerda">Cuerda</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=guitarra">Guitarra</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=bajos">Bajos</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=violines">Violines</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=docerola">Docerola</a></li>
                    </ul>
                </div>

                <!-- Percusión -->
                <div class="categoria-grupo">
                    <div class="categoria-titulo">Percusión</div>
                    <ul class="categoria-lista">
                        <li class="tiene-hijos"><a href="Paginas/catalogo.php?cat=bateria">Batería</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=bateria-infantil">Infantil</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=bateria-junior">Junior</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=bateria-profesional">Profesional</a></li>
                        <li><a href="Paginas/catalogo.php?cat=congos">Congos</a></li>
                        <li><a href="Paginas/catalogo.php?cat=tarola">Tarola</a></li>
                        <li><a href="Paginas/catalogo.php?cat=bongos">Bongos</a></li>
                        <li><a href="Paginas/catalogo.php?cat=timbales">Timbales</a></li>
                        <li><a href="Paginas/catalogo.php?cat=panderos">Panderos</a></li>
                        <li><a href="Paginas/catalogo.php?cat=cencerro">Cencerro</a></li>
                    </ul>
                </div>

                <!-- Viento -->
                <div class="categoria-grupo">
                    <div class="categoria-titulo">Viento</div>
                    <ul class="categoria-lista">
                        <li class="tiene-hijos"><a href="Paginas/catalogo.php?cat=saxofon">Saxofón</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=saxofon-tenor">Tenor</a></li>
                        <li class="sub-item"><a href="Paginas/catalogo.php?cat=saxofon-alto">Alto</a></li>
                        <li><a href="Paginas/catalogo.php?cat=trompeta">Trompeta</a></li>
                        <li><a href="Paginas/catalogo.php?cat=trombon">Trombón</a></li>
                        <li><a href="Paginas/catalogo.php?cat=flauta">Flauta</a></li>
                    </ul>
                </div>

                <!-- Teclado -->
                <div class="categoria-grupo">
                    <div class="categoria-titulo">Teclado</div>
                    <ul class="categoria-lista">
                        <li><span class="sin-sub">Sin subcategorías</span></li>
                    </ul>
                </div>

                <!-- Iluminación LED -->
                <div class="categoria-grupo">
                    <div class="categoria-titulo">Iluminación LED</div>
                    <ul class="categoria-lista">
                        <li><a href="Paginas/catalogo.php?cat=par-led">Par LED</a></li>
                        <li><a href="Paginas/catalogo.php?cat=cabeza-robotica">Cabeza Robótica</a></li>
                        <li><a href="Paginas/catalogo.php?cat=laser">Láser</a></li>
                        <li><a href="Paginas/catalogo.php?cat=estrobo">Estrobo</a></li>
                        <li><a href="Paginas/catalogo.php?cat=camara-humo">Cámara de Humo</a></li>
                    </ul>
                </div>

            </div>
        </div>
    `;
    document.body.appendChild(megamenu);

    // Botón de catálogo en el nav
    const navLinks = document.querySelectorAll('nav a');
    let btnCatalogo = null;

    navLinks.forEach(link => {
        if (link.textContent.trim().toLowerCase().includes('catálogo') ||
            link.textContent.trim().toLowerCase().includes('catalogo')) {
            btnCatalogo = link;
        }
    });

    if (!btnCatalogo) return;

    // Envolver el li en una clase para el indicador
    btnCatalogo.parentElement.classList.add('nav-catalogo');

    // Prevenir navegación y abrir el menú
    btnCatalogo.addEventListener('click', function (e) {
        e.preventDefault();
        toggleMenu();
    });

    // Cerrar al hacer clic en el overlay
    overlay.addEventListener('click', cerrarMenu);

    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') cerrarMenu();
    });

    function toggleMenu() {
        const estaAbierto = megamenu.classList.contains('visible');
        if (estaAbierto) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    }

    function abrirMenu() {
        megamenu.classList.add('visible');
        overlay.classList.add('visible');
        btnCatalogo.parentElement.classList.add('abierto');
        // Evitar scroll del body
        document.body.style.overflow = 'hidden';
    }

    function cerrarMenu() {
        megamenu.classList.remove('visible');
        overlay.classList.remove('visible');
        btnCatalogo.parentElement.classList.remove('abierto');
        document.body.style.overflow = '';
    }

    // Calcular la posición correcta según la altura del header
    function ajustarPosicion() {
        const header = document.querySelector('.menu_navegacion');
        if (header) {
            const altura = header.offsetHeight;
            megamenu.style.top = altura + 'px';
        }
    }

    ajustarPosicion();
    window.addEventListener('resize', ajustarPosicion);
});