const API_BASE =
    "https://casaalvarado-production.up.railway.app";

// =============================
// ENVIAR FORMULARIO
// =============================
document.getElementById('formAgregar')
.addEventListener('submit', async(e)=>{

    e.preventDefault();

    const datos = {

        modelo: modelo.value,
        imagen: imagen.value,
        descripcion: descripcion.value,
        novedad: novedad.value,

        id_marca: Number(id_marca.value),
        id_tipo: Number(id_tipo.value),
        id_gamma: Number(id_gamma.value)
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

// =============================
// CARGAR SELECTS
// =============================
async function cargarOpciones(){

    // FAMILIAS
    await cargarSelect(
        'id_familia',
        `${API_BASE}/familias`
    );

    // TIPOS
    await cargarSelect(
        'id_tipo',
        `${API_BASE}/tipos`
    );

    // GAMMAS
    await cargarSelect(
        'id_gamma',
        `${API_BASE}/gammas`
    );
}

// =============================
// FUNCION GENERICA
// =============================
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

// =============================
// CUANDO CAMBIA FAMILIA
// =============================
id_familia.addEventListener('change', async function(){

    const idFamilia = this.value;

    id_categoria.innerHTML = `
        <option value="">
            Seleccione una categoria
        </option>
    `;

    id_marca.innerHTML = `
        <option value="">
            Seleccione una marca
        </option>
    `;

    if(!idFamilia) return;

    const res = await fetch(
        `${API_BASE}/categorias/familia/${idFamilia}`
    );

    const categorias = await res.json();

    categorias.forEach(categoria => {

        id_categoria.innerHTML += `
            <option value="${categoria.id}">
                ${categoria.nombre}
            </option>
        `;
    });
});

// =============================
// CUANDO CAMBIA CATEGORIA
// =============================
id_categoria.addEventListener('change', async function(){

    const idCategoria = this.value;

    id_marca.innerHTML = `
        <option value="">
            Seleccione una marca
        </option>
    `;

    if(!idCategoria) return;

    const res = await fetch(
        `${API_BASE}/marcas/categoria/${idCategoria}`
    );

    const marcas = await res.json();

    marcas.forEach(marca => {

        id_marca.innerHTML += `
            <option value="${marca.id}">
                ${marca.nombre}
            </option>
        `;
    });
});

// =============================
// INICIAR
// =============================
cargarOpciones();

// ============================
// ACTUALIZAR PRODUCTO
// ============================
formEditar.addEventListener(
    'submit',
    async (e) => {

        e.preventDefault();

        const datos = {

            modelo: modelo.value,
            imagen: imagen.value,
            descripcion: descripcion.value,
            novedad: novedad.value,

            id_marca: Number(
                id_marca.value
            ),

            id_tipo: Number(
                id_tipo.value
            ),

            id_gamma: Number(
                id_gamma.value
            )
        };

        const respuesta = await fetch(
            `${API_BASE}/productos/${modeloOriginal}`,
            {
                method: 'PUT',

                headers: {
                    'Content-Type':
                        'application/json'
                },

                body: JSON.stringify(datos)
            }
        );

        const data =
            await respuesta.json();

        alert(data.mensaje);
    }
);