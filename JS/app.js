// Botón para abrir/cerrar el mega menú
document.addEventListener("componentesCargados", () => {
    const btn = document.getElementById("btnProductos");
    const menu = document.getElementById("megaMenu");

    if (btn && menu) {
        // Abrir/Cerrar al clickear el botón
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            menu.classList.toggle("hidden");
        });

        // NUEVO: Cerrar al hacer clic fuera (Movido desde include.js)
        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.add("hidden");
            }
        });
    }


// Contenedores
const contCat = document.getElementById("categorias")
const titulo = document.getElementById("tituloFamilia")
const grid = document.getElementById("gridcategorias")

let datos = {}

async function cargarMenuDesdeAPI() {

    try {

        const response = await fetch(
            'https://casaalvarado-production.up.railway.app/menu/categorias'
        )

        if (!response.ok) {
            throw new Error('Error cargando menú')
        }

        datos = await response.json()

        generarCategorias()

    } catch(error) {

        console.error(
            'Error cargando menú:',
            error
        )
    }
}
// Función para crear elemento expandible (SOLO para los que tienen items)

// Función para mostrar subcategorías
function mostrarSubcategorias(cat) {

    titulo.textContent = cat
    grid.innerHTML = ""

    const categorias = datos[cat]

    categorias.forEach(nombre => {

        const item = document.createElement("div")

        item.classList.add("item-sub", "simple")

        item.textContent = nombre

        item.addEventListener("click", () => {

            window.location.href =
                `/PAGINAS/catalogo.html?familia=${encodeURIComponent(cat)}&categoria=${encodeURIComponent(nombre)}`
        })

        grid.appendChild(item)
    })

    // quitar activo
    document.querySelectorAll('.cat').forEach(el => {
        el.classList.remove('activo')
    })

    // activar seleccionada
    document.querySelectorAll('.cat').forEach(el => {
        if (el.textContent === cat) {
            el.classList.add('activo')
        }
    })
}
// Generar categorías dinámicamente
function generarCategorias() {

    contCat.innerHTML = ""

    const categorias = Object.keys(datos)

    categorias.forEach(cat => {

        const div = document.createElement("div")

        div.textContent = cat

        div.classList.add("cat")

        div.addEventListener("click", () => {
            mostrarSubcategorias(cat)
        })

        contCat.appendChild(div)
    })

    if (categorias.length > 0) {
        mostrarSubcategorias(categorias[0])
    }
}
cargarMenuDesdeAPI()
})