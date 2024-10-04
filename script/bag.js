
const openBtn = document.getElementById('open_cart_btn');
const closeBtn = document.getElementById('close_btn');
const sideCart = document.getElementById('sidecart');
const itensNum = document.getElementById('itens_num');
const subtotalPrice = document.getElementById('subtotal_price');


let cart = [];


function addToCart(book) {
    const existingBook = cart.find(item => item.title === book.title);
    if (existingBook) {
        if (existingBook.quantity < 10) {
            existingBook.quantity += 1;
        }
    } else {
        book.quantity = 1;
        cart.push(book);
    }
    updateCartUI();
    updateSubtotal();
    openCart();
}


function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart_items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = `
            <div class="cart_item">
                <div class="item_img">
                    <img src="${item.cover}" alt="${item.title}">
                </div>
                <div class="item_details">
                    <p>${item.title}</p>
                    <strong>${item.price}</strong>
                    <div class="qty">
                        <span class="btn">-</span>
                        <strong>${item.quantity}</strong>
                        <span class="btn">+</span>
                    </div>
                    <span class="remove_item"><span>X</span></span>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += cartItem;
    });

    itensNum.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            updateQuantity(e);
        } else if (e.target.closest('.remove_item')) {
            removeItem(e);
        }
    });
}


function openCart(event) {
    if (event) event.preventDefault();
    if (sideCart) {
        sideCart.style.display = 'block';
        sideCart.classList.add('open');
    }
}


function closeCart(event) {
    if (event) event.preventDefault();
    if (sideCart) {
        sideCart.style.display = 'none';
        sideCart.classList.remove('open');
    }
}


const addToCartBtn = document.querySelector('.add_to_cart');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const book = {
            title: document.getElementById('book-title').textContent,
            price: document.getElementById('book-price').textContent.replace('R$', '').trim(),
            cover: document.getElementById('book-cover').src,
        };
        addToCart(book);
    });
}


function updateSubtotal() {
    let subtotal = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price);
        subtotal += price * item.quantity;
    });

    if (subtotalPrice) {
        subtotalPrice.innerText = `R$${subtotal.toFixed(2)}`;
    }
    if (itensNum) {
        itensNum.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    }
}


function updateQuantity(e) {
    const btn = e.target;
    const cartItemElement = btn.closest('.cart_item');
    const itemTitle = cartItemElement.querySelector('p').innerText;
    const item = cart.find(i => i.title === itemTitle);

    if (!item) return;

    if (btn.innerText === '+') {
        if (item.quantity < 10) {
            item.quantity += 1;
        }
    } else if (btn.innerText === '-') {
        if (item.quantity > 1) {
            item.quantity -= 1;
        }
    }

    updateCartUI();
    updateSubtotal();
}


function removeItem(e) {
    const item = e.target.closest('.cart_item');
    const itemTitle = item.querySelector('p').innerText;
    cart = cart.filter(i => i.title !== itemTitle);
    item.remove();
    updateSubtotal();
}


document.addEventListener('DOMContentLoaded', function() {
    updateSubtotal();

    document.querySelectorAll('.qty span').forEach(btn => {
        btn.addEventListener('click', updateQuantity);
    });

    document.querySelectorAll('.remove_item span').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
});


document.addEventListener('click', function(event) {
    if (sideCart && sideCart.classList.contains('open')) {
        if (!sideCart.contains(event.target) && !openBtn.contains(event.target)) {
            closeCart();
        }
    }
});

if (openBtn) openBtn.addEventListener('click', openCart);
if (closeBtn) closeBtn.addEventListener('click', closeCart);