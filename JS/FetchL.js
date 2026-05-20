const BASE_URL = "http://127.0.0.1:8000"
document.getElementById("loginForm").addEventListener("submit", async (e) => {
e.preventDefault();
const datos = {
                correo: document.getElementById("correo").value,
                contrasena: document.getElementById("contrasena").value
            };
const respuesta = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });
const resultado = await respuesta.json();

            alert(resultado.mensaje || resultado.detail);

        });