const API_BASE = 'http://localhost:8000';

let modeloOriginal = '';

async function cargarSelect(idSelect, endpoint){

    const res = await fetch(
        `${API_BASE}/${endpoint}`
    );

    const datos = await res.json();

    const select = document.getElementById(idSelect);

    select.innerHTML = '';

    datos.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nombre}
            </option>
        `;
    });
}

async function cargarTodo(){

    await cargarSelect(
        'id_marca',
        'marcas'
    );

    await cargarSelect(
        'id_categoria',
        'categorias'
    );

    await cargarSelect(
        'id_tipo',
        'tipos'
    );

    await cargarSelect(
        'id_gamma',
        'gammas'
    );
}

async function buscarProducto(){

    // PRIMERO cargar selects
    await cargarTodo();

    const modeloBuscar = buscarModelo.value;

    const res = await fetch(
        `${API_BASE}/productos/buscar/${modeloBuscar}`
    );

    const productos = await res.json();

    if(productos.length === 0){

        alert('Producto no encontrado');

        return;
    }

    const producto = productos[0];

    modeloOriginal = producto.modelo;

    modelo.value = producto.modelo;
    imagen.value = producto.imagen;
    descripcion.value = producto.descripcion;

    // AHORA sí existen las opciones
    id_marca.value = producto.id_marca;
    id_categoria.value = producto.id_categoria;
    id_tipo.value = producto.id_tipo;
    id_gamma.value = producto.id_gamma;
}

formEditar.addEventListener('submit', async(e)=>{

    e.preventDefault();

    const datos = {

        modelo:modelo.value,
        imagen:imagen.value,
        descripcion:descripcion.value,
        novedad:novedad.value,

        id_marca:Number(id_marca.value),
        id_categoria:Number(id_categoria.value),
        id_tipo:Number(id_tipo.value),
        id_gamma:Number(id_gamma.value)
    };

    const respuesta = await fetch(
        `${API_BASE}/productos/${modeloOriginal}`,
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
});
