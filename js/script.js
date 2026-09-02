//filtro para separar hamburguesas, acompañamientos y bebidas
document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.category');
    const productos = document.querySelectorAll('.product-card');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            // Verificamos si el botón que clickeamos ya estaba activo
            const estaActivo = boton.classList.contains('active');

            // Limpiamos la clase 'active' de todos los botones
            botones.forEach(b => b.classList.remove('active'));

            if (estaActivo) {
                // Si ya estaba activo, al hacer clic queremos desmarcarlo
                // y mostrar todos los productos nuevamente
                productos.forEach(producto => {
                    producto.style.display = '';
                });
            } else {
                // Si no estaba activo, lo marcamos y aplicamos el filtro
                boton.classList.add('active');
                const filtro = boton.getAttribute('data-filter');

                productos.forEach(producto => {
                    if (producto.getAttribute('data-category') === filtro) {
                        producto.style.display = '';
                    } else {
                        producto.style.display = 'none';
                    }
                });
            }
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

    // Capturas el botón de registrarse
    const btnRegister = document.querySelector('.btn-register');

// Abres el modal al hacer clic
    if (btnRegister) {
        btnRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }

    const btnUbicacionVina = document.querySelector('#btn-sucursal-vina');

    if (btnUbicacionVina){
        btnUbicacionVina.addEventListener('click', () =>{
            window.open('https://maps.app.goo.gl/gBv29EThxjiRvUTA9', '_blank')
        })
    }

    const btnUbicacionPteAlto = document.querySelector('#btn-sucursal-pte-alto');
    if (btnUbicacionPteAlto){
        btnUbicacionPteAlto.addEventListener('click', () =>{
            window.open('https://maps.app.goo.gl/gQGtiKcHUo6ZeocC8','_blank')
        })
    }

// Interceptar el formulario de contacto para enviar por WhatsApp
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitamos que la página se recargue

            // 1. Obtenemos los valores que el usuario ingresó
            const nombre = document.getElementById('name').value;
            const correo = document.getElementById('email').value;
            const mensaje = document.getElementById('message').value;

            // 2. Construimos el texto
            const textoWhatsApp = `¡Hola! Me llamo ${nombre}.%0A%0AMi correo es ${correo}.%0A%0A${mensaje}`;

            // 3. Definimos el número de destino (código de país + número)
            const numeroDestino = '56967671234';

            // 4. Generamos la URL y la abrimos en una nueva pestaña
            const url = `https://wa.me/${numeroDestino}?text=${textoWhatsApp}`;
            window.open(url, '_blank');

            // 5. Limpiamos el formulario después de enviar
            contactForm.reset();
        });
    }

    // Limitar el rango de fechas en la reserva (Mínimo hoy, máximo 30 días)
    const dateInput = document.getElementById('date');

    if (dateInput) {
        // 1. Obtener la fecha actual (local)
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const day = String(hoy.getDate()).padStart(2, '0');
        const minDate = `${year}-${month}-${day}`;

        // Establecer que no se puedan elegir fechas en el pasado
        dateInput.setAttribute('min', minDate);

        // 2. Calcular la fecha límite (ejemplo: 30 días a partir de hoy)
        const limite = new Date();
        limite.setDate(hoy.getDate() + 30);
        const maxYear = limite.getFullYear();
        const maxMonth = String(limite.getMonth() + 1).padStart(2, '0');
        const maxDay = String(limite.getDate()).padStart(2, '0');
        const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;

        // Establecer el límite máximo en el calendario
        dateInput.setAttribute('max', maxDate);
    }
});
