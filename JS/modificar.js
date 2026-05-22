const API_BASE = 'http://localhost:8000';

let modeloOriginal = '';

// ============================
// CARGAR SELECT GENERICO
// ============================
async function cargarSelect(idSelect, endpoint) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}`);
        const datos = await res.json();
        const select = document.getElementById(idSelect);
        select.innerHTML = '<option value="">Seleccione una opción</option>';
        datos.forEach(item => {
            select.innerHTML += `<option value="${item.id}">${item.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando select:', error);
    }
}

// ============================
// CARGAR CATEGORIAS
// ============================
async function cargarCategorias() {
    try {
        const res = await fetch(`${API_BASE}/categorias`);
        const categorias = await res.json();
        const select = document.getElementById('id_categoria');
        select.innerHTML = '<option value="">Seleccione una categoría</option>';
        categorias.forEach(categoria => {
            select.innerHTML += `<option value="${categoria.id}">${categoria.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

// ============================
// CARGAR MARCAS POR CATEGORIA
// ============================
async function cargarMarcasPorCategoria(idCategoria) {
    try {
        const res = await fetch(`${API_BASE}/marcas/categoria/${idCategoria}`);
        const marcas = await res.json();
        const selectMarca = document.getElementById('id_marca');
        selectMarca.innerHTML = '<option value="">Seleccione una marca</option>';
        marcas.forEach(marca => {
            selectMarca.innerHTML += `<option value="${marca.id}">${marca.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando marcas:', error);
    }
}

// ============================
// CUANDO CAMBIA CATEGORIA
// ============================
const categoriaSelect = document.getElementById('id_categoria');
if (categoriaSelect) {
    categoriaSelect.addEventListener('change', async function() {
        const idCategoria = this.value;
        if (!idCategoria) return;
        await cargarMarcasPorCategoria(idCategoria);
    });
}

// ============================
// CARGAR TODO
// ============================
async function cargarTodo() {
    await cargarCategorias();
    await cargarSelect('id_tipo', 'tipos');
    await cargarSelect('id_gamma', 'gammas');
}

// ============================
// BUSCAR PRODUCTO
// ============================
async function buscarProducto() {
    const buscarModelo = document.getElementById('buscarModelo');
    const modeloBuscar = buscarModelo?.value;
    
    if (!modeloBuscar) {
        alert('Ingrese un modelo para buscar');
        return;
    }
    
    await cargarTodo();
    
    try {
        const res = await fetch(`${API_BASE}/productos/buscar/${modeloBuscar}`);
        const productos = await res.json();
        
        if (productos.length === 0) {
            alert('Producto no encontrado');
            return;
        }
        
        const producto = productos[0];
        modeloOriginal = producto.modelo;
        
        // Llenar inputs
        const modeloInput = document.getElementById('modelo');
        const imagenInput = document.getElementById('imagen');
        const descripcionTextarea = document.getElementById('descripcion');
        const novedadSelect = document.getElementById('novedad');
        
        if (modeloInput) modeloInput.value = producto.modelo;
        if (imagenInput) imagenInput.value = producto.imagen;
        if (descripcionTextarea) descripcionTextarea.value = producto.descripcion;
        if (novedadSelect) novedadSelect.value = producto.novedad || 'No';
        
        // Seleccionar categoria
        const idCategoriaSelect = document.getElementById('id_categoria');
        if (idCategoriaSelect) idCategoriaSelect.value = producto.id_categoria;
        
        // Cargar marcas y seleccionar
        await cargarMarcasPorCategoria(producto.id_categoria);
        
        const idMarcaSelect = document.getElementById('id_marca');
        const idTipoSelect = document.getElementById('id_tipo');
        const idGammaSelect = document.getElementById('id_gamma');
        
        if (idMarcaSelect) idMarcaSelect.value = producto.id_marca;
        if (idTipoSelect) idTipoSelect.value = producto.id_tipo;
        if (idGammaSelect) idGammaSelect.value = producto.id_gamma;
        
        // Mostrar el formulario
        const formEditar = document.getElementById('formEditar');
        if (formEditar) formEditar.style.display = 'block';
        
        // Ocultar mensaje de error si existe
        const mensajeError = document.getElementById('mensajeError');
        if (mensajeError) mensajeError.style.display = 'none';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar el producto');
    }
}

// ============================
// ACTUALIZAR PRODUCTO
// ============================
const formEditar = document.getElementById('formEditar');
if (formEditar) {
    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datos = {
            modelo: document.getElementById('modelo').value,
            imagen: document.getElementById('imagen').value,
            descripcion: document.getElementById('descripcion').value,
            novedad: document.getElementById('novedad').value,
            id_marca: Number(document.getElementById('id_marca').value),
            id_tipo: Number(document.getElementById('id_tipo').value),
            id_gamma: Number(document.getElementById('id_gamma').value)
        };
        
        try {
            const respuesta = await fetch(`${API_BASE}/productos/${modeloOriginal}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            
            const data = await respuesta.json();
            
            if (respuesta.ok) {
                alert('Producto actualizado correctamente');
                window.location.href = '/Admin/consultar.html';
            } else {
                alert(data.detail || 'Error al actualizar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión con el servidor');
        }
    });
}

// Inicializar
cargarTodo();