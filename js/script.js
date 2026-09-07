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
        const btnLogout = document.getElementById('btnLogout');
        const btnRegister = document.getElementById('btnRegisterHeader'); // Asumiendo que agregaste el ID en tu HTML
        if (savedUser){
            btnLogin.textContent= savedUser;
            btnLogin.classList.add('logged-in');
                if (btnLogout) btnLogout.style.display = 'inline-block';
                if (btnRegister) btnRegister.style.display = 'none';
        } else{
            btnLogin.textContent= 'Iniciar sesion';
            btnLogin.classList.remove('logged-in');
                if (btnLogout) btnLogout.style.display = 'none';
                if (btnRegister) btnRegister.style.display = 'inline-block';
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

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('name').value;
            const correo = document.getElementById('email').value;
            const mensaje = document.getElementById('message').value;

            // 1. Definimos el correo de destino
            const correoDestino = 'contacto@elbajondelvicho.cl';

            // 2. Usamos encodeURIComponent para que los espacios y saltos de línea no rompan el formato del correo
            const asunto = encodeURIComponent(`Nuevo mensaje de contacto de: ${nombre}`);
            const cuerpoCorreo = encodeURIComponent(`¡Hola! Me llamo ${nombre}.\n\nMi correo de contacto es: ${correo}\n\n${mensaje}`);

            // 3. Estructuramos la URL con el protocolo mailto:
            const url = `mailto:${correoDestino}?subject=${asunto}&body=${cuerpoCorreo}`;

            // 4. Ejecutamos el enlace en la misma ventana (el navegador abrirá la app de correos automáticamente)
            window.location.href = url;

            // 5. Limpiamos el formulario
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

            // 👇 NUEVO CANDADO: Si el producto está agotado, detenemos la ejecución aquí mismo
            if (card.classList.contains('sin-stock')) {
                return;
            }

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
   // =========================================================
       // 7. MODALES Y LÓGICA DE ENTREGA (DESPACHO / RETIRO)
       // =========================================================
       const deliveryModal = document.getElementById('deliveryModal');
       const addressModal = document.getElementById('addressModal');
       const branchModal = document.getElementById('branchModal'); // NUEVO

       const closeDeliveryModal = document.getElementById('closeDeliveryModal');
       const closeAddressModal = document.getElementById('closeAddressModal');
       const closeBranchModal = document.getElementById('closeBranchModal'); // NUEVO

       const btnOptionDelivery = document.getElementById('btnOptionDelivery');
       const btnOptionPickup = document.getElementById('btnOptionPickup');
       const btnBranchVina = document.getElementById('btnBranchVina'); // NUEVO
       const btnBranchPuente = document.getElementById('btnBranchPuente'); // NUEVO

       const addressForm = document.getElementById('addressForm');
       const addressInput = document.getElementById('addressInput');

       // Cerrar modales con 'X'
       if (closeDeliveryModal) closeDeliveryModal.addEventListener('click', () => deliveryModal.style.display = 'none');
       if (closeAddressModal) closeAddressModal.addEventListener('click', () => addressModal.style.display = 'none');
       if (closeBranchModal) closeBranchModal.addEventListener('click', () => branchModal.style.display = 'none');

       // Cerrar haciendo clic fuera de la caja
       window.addEventListener('click', (e) => {
           if (e.target === deliveryModal) deliveryModal.style.display = 'none';
           if (e.target === addressModal) addressModal.style.display = 'none';
           if (e.target === branchModal) branchModal.style.display = 'none';
       });

       // 1. Al presionar "Confirmar pedido"
       if (btnConfirmar) {
           btnConfirmar.addEventListener('click', () => {
               if (deliveryModal) deliveryModal.style.display = 'flex';
           });
       }

       // 2. Si elige: RETIRO EN TIENDA
       if (btnOptionPickup) {
           btnOptionPickup.addEventListener('click', () => {
               deliveryModal.style.display = 'none';
               if (branchModal) branchModal.style.display = 'flex'; // Abre el modal de sucursales
           });
       }

       // 2.1 Selección de sucursales
       if (btnBranchVina) {
           btnBranchVina.addEventListener('click', () => {
               branchModal.style.display = 'none';
               procesarPedidoFinal(false, 'Viña del Mar');
           });
       }

       if (btnBranchPuente) {
           btnBranchPuente.addEventListener('click', () => {
               branchModal.style.display = 'none';
               procesarPedidoFinal(false, 'Puente Alto');
           });
       }

       // 3. Si elige: DESPACHO A DOMICILIO
       if (btnOptionDelivery) {
           btnOptionDelivery.addEventListener('click', () => {
               deliveryModal.style.display = 'none';

               const correoUsuario = localStorage.getItem('userEmail');

               if (!correoUsuario || correoUsuario === 'Invitado') {
                   alert("⚠️ Para la opción de despacho debes iniciar sesión.");
                   if (modal) modal.style.display = 'flex';
                   return;
               }

               const direccionGuardada = localStorage.getItem('userAddress');
               addressInput.value = direccionGuardada ? direccionGuardada : '';

               if (addressModal) addressModal.style.display = 'flex';
           });
       }

       // 4. Guardar Dirección y Finalizar Pedido
       if (addressForm) {
           addressForm.addEventListener('submit', (e) => {
               e.preventDefault();
               const direccion = addressInput.value.trim();

               if (direccion) {
                   localStorage.setItem('userAddress', direccion);
                   addressModal.style.display = 'none';
                   procesarPedidoFinal(true);
               }
           });
       }

       // Función modificada para recibir la sucursal elegida
       function procesarPedidoFinal(esDespacho, sucursalElegida = null) {
           let totalCantidad = 0;
           let totalPrecio = 0;

           carrito.forEach(item => {
               totalCantidad += item.cantidad;
               totalPrecio += item.precio * item.cantidad;
           });

           document.getElementById('success-items-count').textContent = totalCantidad + (totalCantidad === 1 ? ' producto' : ' productos');
           document.getElementById('success-total-price').textContent = '$' + totalPrecio.toLocaleString('es-CL');
           document.getElementById('success-order-num').textContent = Math.floor(Math.random() * 9000) + 1000;

           const successMessage = document.querySelector('.success-message');
           const correoUsuario = localStorage.getItem('userEmail');

           // Se usa innerHTML para poder poner en negrita el lugar
           if (successMessage) {
               if (esDespacho) {
                   const direccionFinal = localStorage.getItem('userAddress');
                   successMessage.innerHTML = `Te contactaremos a ${correoUsuario} para coordinar el despacho a <br><strong style="color: #ffb800;">${direccionFinal}</strong>.`;
               } else {
                   const correoRetiro = (correoUsuario && correoUsuario !== 'Invitado') ? correoUsuario : 'tu correo';
                   successMessage.innerHTML = `¡Pedido listo para retiro! Te contactaremos a ${correoRetiro} cuando tu bajón esté listo en la sucursal de <br><strong style="color: #ffb800;">${sucursalElegida}<br>🕐 Lunes a Domingo<br>12:00 - 23:00</strong>.`;
               }
           }

           viewOrder.style.display = 'none';
           viewEmpty.style.display = 'none';
           viewSuccess.style.display = 'flex';

           carrito = [];
           localStorage.setItem('carritoBajon', JSON.stringify(carrito));
           cartBadge.textContent = '0';
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


// CERRAR SESIÓN
    const btnLogout = document.getElementById('btnLogout');

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // Borramos solo la sesión del usuario para no destruir la base de datos del Admin
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userAddress');
            localStorage.removeItem('carritoBajon');
            sessionStorage.clear();

            // Recargamos la página para que vuelva a su estado original
            window.location.reload();
        });
    }

}); // <--- ⚠️ ESTA ES LA LLAVE MAESTRA. CIERRA EL BLOQUE PRINCIPAL ANTES DE LA BASE DE DATOS.

// =========================================================
// 8. BASE DE DATOS LOCAL (PRODUCTOS)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const productosBase = [
        { id: "prod-1", nombre: "COMBO CLASICO", desc: "La opción tradicional que nunca falla. Hamburguesa de carne de res con queso cheddar, lechuga fresca, tomate, cebolla morada y aderezos clásicos. Incluye porción de papas fritas y una lata de Coca-Cola.", precio: 8990, stock: true },
        { id: "prod-2", nombre: "COMBO GORILLA GLUE", desc: "Una opción intensa y crujiente. Hamburguesa de carne de res con queso cheddar derretido, tiras de tocino, pepinillos, aros de cebolla empanizados y salsa BBQ. Incluye porción de papas fritas y una lata de Coca-Cola.", precio: 11990, stock: true },
        { id: "prod-3", nombre: "COMBO HAZE", desc: "Una combinación de sabores dulces y salados. Hamburguesa de carne de res con queso cheddar, cebolla caramelizada, pepinillos y una cubierta de mermelada de tocino o relish. Incluye porción de papas fritas y una lata de Coca-Cola.", precio: 11990, stock: true },
        { id: "prod-4", nombre: "COMBO PURPLE HAZE", desc: "El combo más completo. Hamburguesa de carne desmechada con abundante guacamole, rodajas de tomate y queso. Acompañada de papas fritas, crujientes bocados de pollo frito, salsa para untar y una lata de Coca-Cola.", precio: 13990, stock: true },
        { id: "prod-5", nombre: "Papas Fritas Individuales", desc: "Porción individual de papas fritas de corte ondulado, presentadas en bolsa de papel. El tamaño justo para calmar el antojo.", precio: 1990, stock: true },
        { id: "prod-6", nombre: "Nuggets de Pollo", desc: "Clásicos bocados de pollo con un exterior crujiente y dorado. Ideales para compartir o como el acompañamiento perfecto. Porción de 5 unidades.", precio: 2990, stock: true },
        { id: "prod-7", nombre: "Aros de Cebolla", desc: "Aros de cebolla gruesos con un empanizado crujiente y dorado. Un acompañamiento clásico con un suave contraste dulce y salado.", precio: 3490, stock: true },
        { id: "prod-8", nombre: "Mozarella Fingers", desc: "Bastones de queso mozzarella empanizados y fritos hasta alcanzar un dorado crujiente por fuera, con queso suave y fundido por dentro. Porción de 6 unidades.", precio: 4490, stock: true },
        { id: "prod-9", nombre: "Papas Fritas Grandes", desc: "Porción familiar de papas fritas de corte ondulado, servidas calientes y con el punto exacto de sal. Especial para compartir.", precio: 4990, stock: true },
        { id: "prod-10", nombre: "Papas Fritas Vichonas", desc: "Papas fritas de corte ondulado cubiertas con salsa de queso fundido, carne desmechada, tocino, crema ácida y un toque de ciboulette fresco. Una opción contundente.", precio: 7990, stock: true },
        { id: "prod-11", nombre: "Agua Individual", desc: "Botella de agua purificada sin gas por unidad. La opción más ligera, clásica y saludable para mantenerte hidratado.", precio: 1200, stock: true },
        { id: "prod-12", nombre: "Jugo Individual", desc: "Jugo néctar en formato de 400 ml por unidad. Una alternativa dulce y refrescante para acompañar tus comidas. Sabores a elección según disponibilidad", precio: 1500, stock: true },
        { id: "prod-13", nombre: "Bebida en Lata", desc: "Bebida en lata de 350 cc por unidad, servida bien fría. Elige tu sabor favorito entre nuestras distintas opciones clásicas, saborizadas o en su versión sin azúcar.", precio: 1500, stock: true }
    ];

    // Inicializar BD si no existe
    if (!localStorage.getItem('bajon_db_productos')) {
        localStorage.setItem('bajon_db_productos', JSON.stringify(productosBase));
    }

    // Leer BD
    const db = JSON.parse(localStorage.getItem('bajon_db_productos'));

    // Actualizar el DOM con la BD
    db.forEach(prod => {
        const card = document.querySelector(`.product-card[data-id="${prod.id}"]`);
        if (card) {
            // Actualizar textos
            card.querySelector('p').textContent = prod.desc;
            card.querySelector('.product-bottom strong').textContent = '$' + prod.precio.toLocaleString('es-CL');

            // Lógica Sin Stock
            if (prod.stock === false) {
                card.classList.add('sin-stock');
                card.querySelector('.add-button').textContent = 'AGOTADO';
            } else {
                card.classList.remove('sin-stock');
                card.querySelector('.add-button').textContent = '+ AGREGAR';
            }
        }
    });
});