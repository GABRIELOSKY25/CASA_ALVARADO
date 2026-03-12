// Botón para abrir/cerrar el mega menú
const btn = document.getElementById("btnProductos")
const menu = document.getElementById("megaMenu")

btn.addEventListener("click", (e)=>{
    e.preventDefault()
    menu.classList.toggle("hidden")
})

// Datos de categorías y subcategorías (solo nombres)
const datos = {
    Aire:["Flauta","Tuba","Clarinete","Saxofón"],
    Cuerdas:["Guitarra","Violín","Arpa","Bajo"],
    Percusion:["Batería","Tambor","Conga","Cajón"]
}

// Contenedores
const contCat = document.getElementById("categorias")
const titulo = document.getElementById("tituloCategoria")
const grid = document.getElementById("gridSubcategorias")

// Función para mostrar subcategorías
function mostrarSubcategorias(cat){
    titulo.textContent = cat
    grid.innerHTML = ""

    datos[cat].forEach(sub=>{
        const item = document.createElement("div")
        item.classList.add("item-sub")
        item.textContent = sub
        grid.appendChild(item)
    })
}

// Generar categorías dinámicamente y asignar evento
const categorias = Object.keys(datos)
categorias.forEach(cat=>{
    const div = document.createElement("div")
    div.textContent = cat
    div.classList.add("cat")

    div.addEventListener("click", ()=>{
        mostrarSubcategorias(cat)
    })

    contCat.appendChild(div)
})

// Seleccionar la primera categoría por defecto
mostrarSubcategorias(categorias[0])