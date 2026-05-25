// Mostrar/ocultar contraseña
function togglePassword(inputId, iconElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        iconElement.classList.remove('fa-eye');
        iconElement.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        iconElement.classList.remove('fa-eye-slash');
        iconElement.classList.add('fa-eye');
    }
}

// Registro de usuario
document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('registroNombre').value;
    const apellido = document.getElementById('registroApellido').value;
    const correo = document.getElementById('registroCorreo').value;
    const telefono = document.getElementById('registroTelefono').value;
    const contrasena = document.getElementById('registroContrasena').value;
    
    try {
        const response = await fetch('https://casaalvarado-production.up.railway.app/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                correo: correo,
                telefono: telefono,
                contrasena: contrasena
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = 'login.html';
        } else {
            alert(data.detail || 'Error al registrarse');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
});