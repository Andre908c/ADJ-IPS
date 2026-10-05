const API_URL = 'https://expert-orbit-r4p4j5j56759hxqg4-3001.app.github.dev';

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const resDiv = document.getElementById('response');

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            resDiv.style.color = 'green';
            resDiv.innerText = '¡Inicio de sesión exitoso!';
            console.log('Datos:', data);
        } else {
            resDiv.style.color = 'red';
            resDiv.innerText = data.error || 'Credenciales incorrectas';
        }
    } catch (error) {
        resDiv.style.color = 'red';
        resDiv.innerText = 'Error de conexión con el servidor';
        console.error(error);
    }
}