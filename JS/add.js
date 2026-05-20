const API_BASE = 'http://localhost:8000';

document.getElementById('formAgregar')
.addEventListener('submit', async(e)=>{

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
        `${API_BASE}/productos`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(datos)
        }
    );

    const data = await respuesta.json();

    alert(data.mensaje);

    formAgregar.reset();
});

async function cargarOpciones(){

    cargarSelect(
        'id_marca',
        `${API_BASE}/marcas`
    );

    cargarSelect(
        'id_categoria',
        `${API_BASE}/categorias`
    );

    cargarSelect(
        'id_tipo',
        `${API_BASE}/tipos`
    );

    cargarSelect(
        'id_gamma',
        `${API_BASE}/gammas`
    );
}

async function cargarSelect(idSelect, url){

    const res = await fetch(url);

    const datos = await res.json();

    const select = document.getElementById(idSelect);

    datos.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nombre}
            </option>
        `;
    });
}

cargarOpciones();

