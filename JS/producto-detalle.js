// Base de datos de productos (puedes mover esto a un archivo JSON o SQL)
const productos = {
    1: {
        id: 1,
        nombre: "Guitarra Eléctrica Yamaha",
        marca: "Yamaha",
        precio: 7999,
        imagen: "https://images.unsplash.com/photo-1550985616-10810253b84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        descripcion: "Guitarra eléctrica Yamaha de alta calidad con cuerpo de aliso, mástil de arce y diapasón de palisandro. Ideal para principiantes y músicos intermedios. Incluye pastillas de alto rendimiento y hardware cromado.",
        calificacion: 5,
        reseñas: 24
    },
    2: {
        id: 2,
        nombre: "Piano Digital Casio",
        marca: "Casio",
        precio: 12500,
        imagen: "https://images.unsplash.com/photo-1550985616-10810253b84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        descripcion: "Piano digital Casio con 88 teclas con sensibilidad al tacto, 18 tonos integrados, polifonía de 64 voces. Incluye pedal de sustain y atril. Perfecto para estudio y presentaciones.",
        calificacion: 4,
        reseñas: 18
    },
    3: {
        id: 3,
        nombre: "Batería Acústica Pearl",
        marca: "Pearl",
        precio: 15999,
        imagen: "https://images.unsplash.com/photo-1550985616-10810253b84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        descripcion: "Batería acústica Pearl de 5 piezas con platillos incluidos. Parches Remo, herrajes cromados y acabado en laca brillante. Sonido profesional para todos los géneros musicales.",
        calificacion: 5,
        reseñas: 32
    },
    // Agrega más productos aquí...
};

// Número de WhatsApp de la tienda
const WHATSAPP_NUMBER = "529671330637";

// Obtener ID del producto de la URL
const urlParams = new URLSearchParams(window.location.search);
const productoId = urlParams.get('id');

// Cargar producto
function cargarProducto() {
    if (!productoId || !productos[productoId]) {
        alert('Producto no encontrado');
        window.location.href = 'catalogo.html';
        return;
    }

    const producto = productos[productoId];

    // Actualizar título
    document.title = `${producto.nombre} - Casa Alvarado`;
    document.getElementById('titulo-producto').textContent = producto.nombre;

    // Actualizar imagen
    document.getElementById('img-producto').src = producto.imagen;
    document.getElementById('img-producto').alt = producto.nombre;

    // Actualizar detalles
    document.getElementById('nombre-producto').textContent = producto.nombre;
    document.getElementById('marca-producto').textContent = producto.marca;
    document.getElementById('precio-producto').textContent = `$${producto.precio.toLocaleString()}`;
    document.getElementById('descripcion-producto').textContent = producto.descripcion;

    // Generar estrellas
    generarEstrellas(producto.calificacion);
    document.getElementById('texto-calificacion').textContent = `(${producto.reseñas} reseñas)`;

    // Configurar botón WhatsApp con mensaje específico del producto
    const mensajeWhatsApp = `Hola Casa Alvarado, quiero saber más de este producto: ${producto.nombre}`;
    const whatsappURL = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(mensajeWhatsApp)}`;
    document.getElementById('btn-whatsapp').href = whatsappURL;

    // Cargar productos similares
    cargarProductosSimilares(producto.id);
}

// Generar estrellas de calificación
function generarEstrellas(calificacion) {
    const contenedor = document.getElementById('estrellas-producto');
    contenedor.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const estrella = document.createElement('span');
        estrella.className = 'estrella' + (i <= calificacion ? '' : ' vacia');
        estrella.textContent = '★';
        contenedor.appendChild(estrella);
    }
}

// Cargar productos similares (aleatorios excluyendo el actual)
function cargarProductosSimilares(productoActualId) {
    const contenedor = document.getElementById('productos-similares');
    const todosProductos = Object.values(productos).filter(p => p.id != productoActualId);
    const similares = todosProductos.sort(() => 0.5 - Math.random()).slice(0, 4);

    contenedor.innerHTML = similares.map(producto => `
        <div class="targeta_producto">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">$${producto.precio.toLocaleString()}</p>
            <a href="producto-detalle.html?id=${producto.id}" class="boton_producto"> Ver Más</a>
        </div>
    `).join('');
}

// Inicializar
document.addEventListener('DOMContentLoaded', cargarProducto);