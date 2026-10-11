cat > /workspaces/ADJ-IPS/frontend/app.js << 'EOF'
const API_URL = 'https://expert-orbit-r4p4j5j56759hxqg4-3004.app.github.dev';

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const resDiv = document.getElementById('response');

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            resDiv.style.color = 'green';
            resDiv.innerText = '¡Inicio de sesión exitoso!';

            localStorage.setItem('token', data.token);
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            localStorage.setItem('rol', payload.rol);
            localStorage.setItem('username', payload.username);

            window.location.href = payload.rol === 'medico'
                ? 'dashboard-medico.html'
                : 'dashboard-paciente.html';
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
EOF