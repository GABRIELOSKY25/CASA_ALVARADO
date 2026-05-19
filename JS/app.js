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
const titulo = document.getElementById("tituloCategoria")
const grid = document.getElementById("gridSubcategorias")

let datos = {}

async function cargarMenuDesdeAPI() {

    try {

        const response = await fetch(
            'http://127.0.0.1:8000/menu/categorias'
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
function crearElementoExpandible(nombre, items) {
    const contenedor = document.createElement("div")
    contenedor.classList.add("expandible-container")
    
    const header = document.createElement("div")
    header.classList.add("expandible-header")
    
    const flecha = document.createElement("span")
    flecha.classList.add("expandible-flecha")
    flecha.textContent = "▶"
    
    const texto = document.createElement("span")
    texto.classList.add("expandible-texto")
    texto.textContent = nombre
    
    header.appendChild(flecha)
    header.appendChild(texto)
    
    const contenido = document.createElement("div")
    contenido.classList.add("expandible-contenido")
    
    items.forEach(item => {
        const itemDiv = document.createElement("div")
        itemDiv.classList.add("expandible-item")
        itemDiv.textContent = item
        contenido.appendChild(itemDiv)
    })
    
    // Evento para expandir/contraer
    header.addEventListener("click", (e) => {
        e.stopPropagation()
        contenedor.classList.toggle("expandido")
        flecha.textContent = contenedor.classList.contains("expandido") ? "▼" : "▶"
    })
    
    contenedor.appendChild(header)
    contenedor.appendChild(contenido)
    
    return contenedor
}

// Función para crear item simple (sin expandir)
function crearItemSimple(nombre) {
    const item = document.createElement("div")
    item.classList.add("item-sub", "simple")
    item.textContent = nombre
    
    // Opcional: agregar funcionalidad de clic
    item.addEventListener("click", () => {
    window.location.href =
        `/Paginas/catalogo.html?categoria=${encodeURIComponent(nombre)}`;
    })
    
    return item
}

// Función para mostrar subcategorías
function mostrarSubcategorias(cat){
    titulo.textContent = cat
    grid.innerHTML = ""

    const contenido = datos[cat]
    
    // Si es un array (lista simple)
    if (Array.isArray(contenido)) {
        contenido.forEach(sub => {
            grid.appendChild(crearItemSimple(sub))
        })
    } 
    // Si es un objeto (tiene subcategorías)
    else if (typeof contenido === 'object') {
        for (const [subcat, items] of Object.entries(contenido)) {
            if (items.length > 0) {
                // Tiene subcategorías -> expandible
                grid.appendChild(crearElementoExpandible(subcat, items))
            } else {
                // No tiene subcategorías -> item simple
                grid.appendChild(crearItemSimple(subcat))
            }
        }
    }
    
    // Quitar clase activo de todas las categorías
    document.querySelectorAll('.cat').forEach(el => {
        el.classList.remove('activo')
    })
    
    // Agregar clase activo a la categoría seleccionada
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