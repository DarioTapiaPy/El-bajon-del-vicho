

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