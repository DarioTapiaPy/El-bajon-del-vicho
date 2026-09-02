document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 1. FILTRO CATEGORÍAS (CON TOGGLE)
    // =========================================================
    const botones = document.querySelectorAll('.category');
    const productos = document.querySelectorAll('.product-card');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const estaActivo = boton.classList.contains('active');
            botones.forEach(b => b.classList.remove('active'));

            if (estaActivo) {
                productos.forEach(producto => {
                    producto.style.display = '';
                });
            } else {
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

    // =========================================================
    // 2. MODAL INICIO SESIÓN Y LOCALSTORAGE
    // =========================================================
    const btnLogin = document.querySelector('.btn-login');
    const modal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModal');
    const loginForm = document.getElementById('modalLoginForm');
    const guestBtn = document.getElementById('guestBtn');

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

    checkSession(); // Inicializar sesión al cargar

    const btnRegister = document.querySelector('.btn-register');
    if (btnRegister) {
        btnRegister.addEventListener('click', (e) => {
            e.preventDefault();
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    }

    // =========================================================
    // 3. MAPAS SUCURSALES
    // =========================================================
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

    // =========================================================
    // 4. CONTACTO WHATSAPP
    // =========================================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('name').value;
            const correo = document.getElementById('email').value;
            const mensaje = document.getElementById('message').value;

            const textoWhatsApp = `¡Hola! Me llamo ${nombre}.%0A%0AMi correo es ${correo}.%0A%0A${mensaje}`;
            const numeroDestino = '56967671234';

            const url = `https://wa.me/${numeroDestino}?text=${textoWhatsApp}`;
            window.open(url, '_blank');

            contactForm.reset();
        });
    }

    // =========================================================
    // 5. RANGO DE FECHAS RESERVA
    // =========================================================
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const hoy = new Date();
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        const day = String(hoy.getDate()).padStart(2, '0');
        const minDate = `${year}-${month}-${day}`;

        dateInput.setAttribute('min', minDate);

        const limite = new Date();
        limite.setDate(hoy.getDate() + 30);
        const maxYear = limite.getFullYear();
        const maxMonth = String(limite.getMonth() + 1).padStart(2, '0');
        const maxDay = String(limite.getDate()).padStart(2, '0');
        const maxDate = `${maxYear}-${maxMonth}-${maxDay}`;

        dateInput.setAttribute('max', maxDate);
    }

    // =========================================================
    // 6. CARRITO DE COMPRAS
    // =========================================================
    const cartElement = document.querySelector('.cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.querySelector('.cart-total');
    const cartBadge = document.querySelector('.cart-button span');
    const btnOpenCart = document.querySelector('.cart-button');
    const addButtons = document.querySelectorAll('.add-button');

    const viewOrder = document.getElementById('cart-view-order');
    const viewSuccess = document.getElementById('cart-view-success');
    const viewEmpty = document.getElementById('cart-view-empty'); // NUEVO
    const btnConfirmar = document.getElementById('btn-confirmar');
    const btnSeguirComprando = document.getElementById('btn-seguir-comprando');
    const btnIrMenu = document.getElementById('btn-ir-menu'); // NUEVO

    // Necesitamos seleccionar dinámicamente todos los botones de cerrar (ahora son 3)
    const btnCloseCartAll = document.querySelectorAll('.close-cart');

    let carrito = JSON.parse(localStorage.getItem('carritoBajon')) || [];

    function actualizarCarrito() {
        localStorage.setItem('carritoBajon', JSON.stringify(carrito));
        cartItemsContainer.innerHTML = '';

        let totalPrecio = 0;
        let totalCantidad = 0;

        // --- LÓGICA DE INTERCAMBIO DE VISTAS ---
        if (carrito.length === 0) {
            viewOrder.style.display = 'none';
            viewSuccess.style.display = 'none';
            viewEmpty.style.display = 'flex'; // Mostramos pantalla vacía
            cartBadge.textContent = '0';
            return; // Cortamos la función acá porque no hay nada que calcular
        } else {
            viewOrder.style.display = 'flex';
            viewEmpty.style.display = 'none';
        }
        // ----------------------------------------

        carrito.forEach((item, index) => {
            totalPrecio += item.precio * item.cantidad;
            totalCantidad += item.cantidad;

            const precioFormateado = '$' + item.precio.toLocaleString('es-CL');

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');

            itemDiv.innerHTML = `
                <div>
                    <strong>${item.titulo}</strong>
                    <p>${precioFormateado}</p>
                    <button class="btn-quitar" data-index="${index}">Quitar</button>
                </div>
                <div class="quantity">
                    <button class="btn-restar" data-index="${index}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-sumar" data-index="${index}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        cartTotalElement.textContent = '$' + totalPrecio.toLocaleString('es-CL');
        cartBadge.textContent = totalCantidad;

        const subtotalElement = document.querySelector('.cart-summary div:first-child strong');
        if(subtotalElement) subtotalElement.textContent = '$' + totalPrecio.toLocaleString('es-CL');
    }

    // Abrir carrito
    btnOpenCart.addEventListener('click', () => {
        cartElement.classList.add('open');
    });

    // Cerrar carrito (sirve para las 'x' de las tres vistas)
    btnCloseCartAll.forEach(btn => {
        btn.addEventListener('click', () => {
            cartElement.classList.remove('open');

            // Cuando termina la animación de cerrarse, actualizamos las vistas por detrás
            setTimeout(() => {
                actualizarCarrito();
            }, 300);
        });
    });

    // Funcionalidad "+ AGREGAR"
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const titulo = card.querySelector('h3').textContent.trim();
            const precioTexto = card.querySelector('.product-bottom strong').textContent.trim();

            const precio = parseInt(precioTexto.replace('$', '').replace('.', ''));
            const itemExistente = carrito.find(item => item.titulo === titulo);

            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({ titulo, precio, cantidad: 1 });
            }

            actualizarCarrito();
            cartElement.classList.add('open');
        });
    });

    // Sumar, restar o quitar desde dentro del carrito
    cartItemsContainer.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');

        if (e.target.classList.contains('btn-sumar')) {
            carrito[index].cantidad++;
            actualizarCarrito();
        }

        if (e.target.classList.contains('btn-restar')) {
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
            }
            actualizarCarrito();
        }

        if (e.target.classList.contains('btn-quitar')) {
            carrito.splice(index, 1);
            actualizarCarrito();
        }
    });

    // Confirmar pedido
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            let totalCantidad = 0;
            let totalPrecio = 0;
            carrito.forEach(item => {
                totalCantidad += item.cantidad;
                totalPrecio += item.precio * item.cantidad;
            });

            document.getElementById('success-items-count').textContent = totalCantidad + (totalCantidad === 1 ? ' producto' : ' productos');
            document.getElementById('success-total-price').textContent = '$' + totalPrecio.toLocaleString('es-CL');
            document.getElementById('success-order-num').textContent = Math.floor(Math.random() * 9000) + 1000;

            // Mostramos el mensaje de éxito
            viewOrder.style.display = 'none';
            viewEmpty.style.display = 'none';
            viewSuccess.style.display = 'flex';

            // Vaciamos la memoria y actualizamos el icono, pero NO llamamos a actualizarCarrito() para no romper la vista
            carrito = [];
            localStorage.setItem('carritoBajon', JSON.stringify(carrito));
            cartBadge.textContent = '0';
        });
    }

    // Botón "Seguir comprando"
    if (btnSeguirComprando) {
        btnSeguirComprando.addEventListener('click', () => {
            cartElement.classList.remove('open');

            // Actualizamos la vista por detrás para que al abrirlo de nuevo esté vacío
            setTimeout(() => {
                actualizarCarrito();
            }, 300);
        });
    }

    // Botón "Ver el menú" de la pantalla vacía
    if (btnIrMenu) {
        btnIrMenu.addEventListener('click', () => {
            cartElement.classList.remove('open');
        });
    }

    // Cargar visualmente el carrito al iniciar la página
    actualizarCarrito();
});