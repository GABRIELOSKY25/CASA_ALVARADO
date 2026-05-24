const BASE_URL = "http://127.0.0.1:8000";

document.getElementById("registroForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const datos = {
        nombre: document.getElementById("registroNombre").value,
        apellido: document.getElementById("registroApellido").value,
        correo: document.getElementById("registroCorreo").value,
        telefono: document.getElementById("registroTelefono").value,
        contrasena: document.getElementById("registroContrasena").value
    };
    
    try {
        const respuesta = await fetch(`${BASE_URL}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await respuesta.json();
        
        if (respuesta.ok) {
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            window.location.href = "./login.html";
        } else {
            alert(resultado.detail || resultado.mensaje || "Error al registrarse");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor");
    }
});