const API_BASE = 'http://localhost:8000';

console.log('JS CARGADO');

const selectCategoria = document.getElementById('categoria');
const selectMarca = document.getElementById('marca');
const selectPrioridad = document.getElementById('prioridad');


// =========================
// CARGAR CATEGORÍAS
// =========================

async function cargarCategorias(){

    const res = await fetch(
        `${API_BASE}/categorias`
    );

    const categorias = await res.json();

    console.log(categorias);

    selectCategoria.innerHTML = `
        <option value="">
            Selecciona una categoría
        </option>
    `;

    categorias.forEach(c => {

        selectCategoria.innerHTML += `
            <option value="${c.id}">
                ${c.nombre}
            </option>
        `;
    });
}


// =========================
// CARGAR MARCAS
// =========================

async function cargarMarcas(){

    const idCategoria = selectCategoria.value;

    console.log('Categoria:', idCategoria);

    if(!idCategoria){
        return;
    }

    const res = await fetch(
        `${API_BASE}/marcas/categoria/${idCategoria}`
    );

    const marcas = await res.json();

    console.log(marcas);

    selectMarca.innerHTML = `
        <option value="">
            Selecciona una marca
        </option>
    `;

    marcas.forEach(m => {

        selectMarca.innerHTML += `
            <option value="${m.id_marca}">
                ${m.nombre}
            </option>
        `;
    });
}


// =========================
// GUARDAR PRIORIDAD
// =========================

async function guardarPrioridad(){

    const datos = {

        prioridad: prioridad.value

    };

    console.log(datos);

    const respuesta = await fetch(
        `${API_BASE}/marcas/${marca.value}`,
        {
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(datos)
        }
    );

    const data = await respuesta.json();

    alert(data.mensaje);
}


// =========================
// EVENTO
// =========================

selectCategoria.addEventListener(
    'change',
    cargarMarcas
);


// =========================
// INICIAR
// =========================

cargarCategorias();