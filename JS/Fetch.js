const BASE_URL = "http://127.0.0.1:8000"

document.getElementById("signInForm").addEventListener("submit", async (e) => {
e.preventDefault();
const datos = {
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                correo: document.getElementById("correo").value,
                telefono: document.getElementById("telefono").value,
                contrasena: document.getElementById("contrasena").value
            };
const respuesta = await fetch(`${BASE_URL}/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });
const resultado = await respuesta.json();

            alert(resultado.mensaje || resultado.detail);

        });

