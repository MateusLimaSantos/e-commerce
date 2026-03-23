document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('admin-login-form');
    const errorBox = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        errorBox.classList.add('hidden');
        errorBox.textContent = '';
        loginBtn.disabled = true;
        loginBtn.textContent = 'Verificando...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'E-mail ou senha incorretos.');
            }

            localStorage.setItem('shop_admin_token', data.access_token);
            window.location.href = 'admin-dashboard.html';

        } catch (error) {
            errorBox.textContent = error.message;
            errorBox.classList.remove('hidden');
        } finally {
            loginBtn.disabled = false;
            loginBtn.textContent = 'Entrar no Sistema';
        }
    });
});