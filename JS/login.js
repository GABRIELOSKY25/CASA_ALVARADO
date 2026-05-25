// Login de usuario
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const correo = document.getElementById('loginCorreo').value;
    const contrasena = document.getElementById('loginContrasena').value;
    
    try {
        const response = await fetch('https://casaalvarado-production.up.railway.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar token o datos del usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            
            alert('Inicio de sesión exitoso');
            window.location.href = 'catalogo.html';
        } else {
            alert(data.detail || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
    }
});