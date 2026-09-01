

//filtro para separar hamburguesas, acompañamientos y bebidas

document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.category');
    const productos = document.querySelectorAll('.product-card');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            botones.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');

            const filtro = boton.getAttribute('data-filter');

            productos.forEach(producto => {
                if (producto.getAttribute('data-category') === filtro) {
                    producto.style.display = '';
                } else {
                    producto.style.display = 'none';
                }
            });
        });
    });
});

//filtro para inciar sesion
document.addEventListener('DOMContentLoaded',()=>{

    const btnLogin = document.querySelector('.btn-login');
    const modal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModal');
    const loginForm = document.getElementById('modalLoginForm');
    const guestBtn = document.getElementById('guestBtn');

    //Verificacion del estado de sesion en el localStorage
    function checkSession(){
        const savedUser = localStorage.getItem('userEmail');

        if (savedUser){
            btnLogin.textContent= savedUser;
            btnLogin.classList.add('logged-in');
        } else{
            btnLogin.textContent= 'Iniciar sesion';
            btnLogin.classList.remove('logged-in');
        }

    }
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            const currentUser = localStorage.getItem('userEmail');

            if (currentUser) {
                if (confirm(`¿Quieres cerrar la sesión de ${currentUser}?`)) {
                    localStorage.removeItem('userEmail');
                    checkSession();
                }
            } else {
                // Verificación para evitar el error 'read properties of null'
                if (modal) {
                    modal.style.display = 'flex';
                } else {
                    console.error('El modal con id "loginModal" no fue encontrado en el HTML.');
                }
            }
        });
    }
    if (closeModalBtn){
        closeModalBtn.addEventListener('click',() => {
            modal.style.display= 'none';
        });
    }
    window.addEventListener('click',(e) =>{
        if (e.target === modal){
            modal.style.display ='none';
        }
    });
    if (loginForm){
        loginForm.addEventListener('submit',(e) => {
            e.preventDefault();
            const emailInput = document.getElementById('modalEmail').value;

            localStorage.setItem('userEmail', emailInput);
            modal.style.display = 'none';
            loginForm.reset();
            checkSession();
        });
    }
    if (guestBtn){
        guestBtn.addEventListener('click',() =>{
            localStorage.setItem('userEmail', 'Invitado');
            modal.style.display = 'none';
            checkSession();
        });
    }
    checkSession();





});