const API_BASE =
    "https://TU-APP.up.railway.app";

console.log('JS CARGADO');

const selectCategoria = document.getElementById('categoria');
const selectMarca = document.getElementById('marca');
const selectPrioridad = document.getElementById('prioridad');

// =========================
// CARGAR CATEGORÍAS
// =========================
async function cargarCategorias() {
    try {
        const res = await fetch(`${API_BASE}/categorias`);
        const categorias = await res.json();
        
        console.log('Categorías:', categorias);
        
        selectCategoria.innerHTML = '<option value="">Seleccione una categoría</option>';
        
        categorias.forEach(c => {
            selectCategoria.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

// =========================
// CARGAR MARCAS
// =========================
async function cargarMarcas() {
    const idCategoria = selectCategoria.value;
    
    console.log('Categoría seleccionada:', idCategoria);
    
    if (!idCategoria) {
        selectMarca.disabled = true;
        selectMarca.innerHTML = '<option value="">Primero seleccione una categoría</option>';
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE}/marcas/categoria/${idCategoria}`);
        const marcas = await res.json();
        
        console.log('Marcas:', marcas);
        
        selectMarca.disabled = false;
        selectMarca.innerHTML = '<option value="">Seleccione una marca</option>';
        
        marcas.forEach(m => {
            selectMarca.innerHTML += `<option value="${m.id}">${m.nombre}</option>`;
        });
    } catch (error) {
        console.error('Error cargando marcas:', error);
    }
}

// =========================
// GUARDAR PRIORIDAD
// =========================
async function guardarPrioridad() {
    const idMarca = selectMarca.value;
    const prioridadValor = selectPrioridad.value;
    
    if (!idMarca) {
        alert('Por favor, seleccione una marca');
        return;
    }
    
    const datos = {
        prioridad: prioridadValor
    };
    
    console.log('Datos a guardar:', datos);
    
    try {
        const respuesta = await fetch(`${API_BASE}/marcas/${idMarca}/prioridad`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            alert(data.mensaje || 'Prioridad actualizada correctamente');
        } else {
            alert(data.detail || 'Error al actualizar la prioridad');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
}

// =========================
// EVENTOS
// =========================
selectCategoria.addEventListener('change', cargarMarcas);

// =========================
// INICIAR
// =========================
cargarCategorias();