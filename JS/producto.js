
async function cargarProducto() {
        const params = new URLSearchParams(window.location.search);
        const modelo = params.get("modelo");

        if (!modelo) {
            alert("No se especificó producto");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/producto/${modelo}`
            );

            if (!response.ok) {
                throw new Error("Error HTTP: " + response.status);
            }

            const producto = await response.json();

            document.getElementById("producto-img").src =
                producto.imagen;

            document.getElementById("producto-marca").textContent =
                producto.marca;

            document.getElementById("producto-modelo").textContent =
                producto.modelo;

            document.getElementById("producto-descripcion").textContent =
                producto.descripcion;

            
            const estrellas = producto.estrellas;

            // desmarcar todas primero (recomendado)
            for (let i = 1; i <= 5; i++) {
                const radio = document.getElementById(`star${i}`);
                if (radio) radio.checked = false;
            }

            // marcar estrella correspondiente
            const starElement = document.getElementById(`star${estrellas}`);
            if (starElement) {
                starElement.checked = true;
            }
            
            document.getElementById("rating-num").textContent =
            `(${estrellas})`;    
        } catch (error) {
            console.error(error);
            alert("Error cargando producto");
        }
    }
cargarProducto();
