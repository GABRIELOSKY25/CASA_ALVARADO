async function cargarMarcaDestacada() {

    try {

        const params = new URLSearchParams(window.location.search);

        const categoria = params.get("categoria");

        console.log("Categoria enviada:", categoria);

        const response = await fetch(
            `${API_BASE}/marca/destacada?categoria=${categoria}`
        );

        const marca = await response.json();

        console.log("Marca recibida:", marca);

        const marcaLogo = document.getElementById('marcaLogo');

        if (marcaLogo && marca.imagen) {

            marcaLogo.src = marca.imagen;

            marcaLogo.style.display = 'block';
        }

    } catch (error) {

        console.error('Error cargando marca destacada:', error);
    }
}

async function cargarCarruselMarcas() {

    try {

        const params = new URLSearchParams(window.location.search);

        const categoria = params.get("categoria");

        console.log("Categoria enviada:", categoria);

        const response = await fetch(
            `${API_BASE}/marcas/todas?categoria=${categoria}`
        );

        const marcas = await response.json();

        console.log("Marcas recibidas:", marcas);

        const track = document.getElementById('track');

        track.innerHTML = marcas.map(marca => `
            <div
                class="carrusel-item"
                data-nombre="${marca.nombre}"
            >
                <img
                    src="${marca.imagen || 'https://via.placeholder.com/180x80?text=' + marca.nombre}"
                    alt="${marca.nombre}"
                >
            </div>
        `).join('');

        itemsPerView = getItemsPerView();

        updateCarrusel();

    } catch (error) {

        console.error('Error cargando marcas:', error);
    }
}