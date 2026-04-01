// include.js
async function cargarComponente(id, ruta) {
    try {
        const res = await fetch(ruta);
        const html = await res.text();
        const contenedor = document.getElementById(id);
        if (contenedor) {
            contenedor.innerHTML = html;
        }
    } catch (error) {
        console.error("Error cargando componente:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Cargamos los componentes
    await cargarComponente("header", "/components/header.html");
    await cargarComponente("footer", "/components/footer.html");

    // 2. Avisamos que ya están listos
    document.dispatchEvent(new Event("componentesCargados"));
});