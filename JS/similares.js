async function cargarProductosSimilares(modelo) {

    try {

        const response = await fetch(
            `http://127.0.0.1:8000/productos-similares/${modelo}`
        );

        const productos = await response.json();

        const contenedor = document.getElementById(
            "productos-similares"
        );

        contenedor.innerHTML = "";

        productos.forEach(producto => {

            let estrellasHTML = "";

            const estrellas = Math.round(producto.estrellas);

            for (let i = 1; i <= 5; i++) {
                estrellasHTML += i <= estrellas ? "★" : "☆";
            }

            contenedor.innerHTML += `
                <div class="tarjeta_producto">

                    <img src="${producto.imagen}" 
                         alt="${producto.modelo}">

                    <h3>${producto.modelo}</h3>

                    <div class="rating">
                        <span>(${producto.estrellas})</span>
                        ${estrellasHTML}
                    </div>

                    <a href="producto.html?modelo=${producto.modelo}" 
                       class="boton_producto">
                       Ver más
                    </a>

                </div>
            `;
        });
        function verProducto(id) {

        window.location.href =
        `producto.html?id=${id}`;
}
    } catch(error) {
        console.error(error);
    }
}

async function cargarProducto() {

    const params = new URLSearchParams(window.location.search);

    const modelo = params.get("modelo");

    if (!modelo) return;

    const response = await fetch(
        `http://127.0.0.1:8000/producto/${modelo}`
    );

    const producto = await response.json();

    // cargar producto principal...

    // 🔥 CARGAR SIMILARES
    cargarProductosSimilares(modelo);
}

cargarProducto();
