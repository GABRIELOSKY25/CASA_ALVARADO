const API_BASE = 'http://localhost:8000';

let modeloOriginal = '';

// ============================
// CARGAR SELECT GENERICO
// ============================
async function cargarSelect(idSelect, endpoint) {

    const res = await fetch(
        `${API_BASE}/${endpoint}`
    );

    const datos = await res.json();

    const select =
        document.getElementById(idSelect);

    select.innerHTML = '';

    datos.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.nombre}
            </option>
        `;
    });
}

// ============================
// CARGAR CATEGORIAS
// ============================
async function cargarCategorias() {

    const res = await fetch(
        `${API_BASE}/categorias`
    );

    const categorias = await res.json();

    const select =
        document.getElementById('id_categoria');

    select.innerHTML = `
        <option value="">
            Seleccione una categoria
        </option>
    `;

    categorias.forEach(categoria => {

        select.innerHTML += `
            <option value="${categoria.id}">
                ${categoria.nombre}
            </option>
        `;
    });
}

// ============================
// CARGAR MARCAS POR CATEGORIA
// ============================
async function cargarMarcasPorCategoria(idCategoria) {

    const res = await fetch(
        `${API_BASE}/marcas/categoria/${idCategoria}`
    );

    const marcas = await res.json();

    const selectMarca =
        document.getElementById('id_marca');

    selectMarca.innerHTML = `
        <option value="">
            Seleccione una marca
        </option>
    `;

    marcas.forEach(marca => {

        selectMarca.innerHTML += `
            <option value="${marca.id}">
                ${marca.nombre}
            </option>
        `;
    });
}

// ============================
// CUANDO CAMBIA CATEGORIA
// ============================
document.getElementById('id_categoria')
.addEventListener('change', async function () {

    const idCategoria = this.value;

    if (!idCategoria) return;

    await cargarMarcasPorCategoria(
        idCategoria
    );
});

// ============================
// CARGAR TODO
// ============================
async function cargarTodo() {

    await cargarCategorias();

    await cargarSelect(
        'id_tipo',
        'tipos'
    );

    await cargarSelect(
        'id_gamma',
        'gammas'
    );
}

// ============================
// BUSCAR PRODUCTO
// ============================
async function buscarProducto() {

    await cargarTodo();

    const modeloBuscar =
        buscarModelo.value;

    const res = await fetch(
        `${API_BASE}/productos/buscar/${modeloBuscar}`
    );

    const productos =
        await res.json();

    if (productos.length === 0) {

        alert('Producto no encontrado');

        return;
    }

    const producto = productos[0];

    modeloOriginal =
        producto.modelo;

    // ========================
    // LLENAR INPUTS
    // ========================
    modelo.value =
        producto.modelo;

    imagen.value =
        producto.imagen;

    descripcion.value =
        producto.descripcion;

    novedad.value =
        producto.novedad;

    // ========================
    // SELECCIONAR CATEGORIA
    // ========================
    id_categoria.value =
        producto.id_categoria;

    // ========================
    // CARGAR MARCAS
    // ========================
    await cargarMarcasPorCategoria(
        producto.id_categoria
    );

    // ========================
    // SELECCIONAR MARCA
    // ========================
    id_marca.value =
        producto.id_marca;

    id_tipo.value =
        producto.id_tipo;

    id_gamma.value =
        producto.id_gamma;
}

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