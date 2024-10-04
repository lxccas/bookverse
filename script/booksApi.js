const apiKey = 'AIzaSyCgfacSBjjf1Ah94qwnQOXfWhdBomOM2vg';

async function fetchBooksByGenre(genre) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}+&filter=paid-ebooks&key=${apiKey}&maxResults=6`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Erro ao buscar livros:', error);
        return [];
    }
}

function displayBooks(books, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    books.map(book => {
        const bookInfo = book.volumeInfo;
        const price = book.saleInfo && book.saleInfo.listPrice ? `R$${book.saleInfo.listPrice.amount}` : 'Preço indisponível';
        const thumbnail = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'image/default_book.jpg';
        const authors = bookInfo.authors ? bookInfo.authors.join(', ') : 'Autor desconhecido';
        const categories = bookInfo.categories ? bookInfo.categories.join(', ') : 'Categoria desconhecida';
        const bookId = book.id;

        return `
            <a href="#" class="featured_book_card" data-book-id="${bookId}">
                <div class="featured_book_img">
                    <img src="${thumbnail}" alt="${bookInfo.title}">
                </div>
                <div class="featured_book_tag">
                    <h2>${bookInfo.title}</h2>
                    <p class="writer">${authors}</p>
                    <div class="categories">${categories}</div>
                    <p class="book_price">${price}</p>
                </div>
            </a>
        `;
    }).forEach(bookCard => {
        container.innerHTML += bookCard;
    });

    document.querySelectorAll(`#${containerId} .featured_book_card`).forEach(card => {
        card.addEventListener('click', (event) => {
            event.preventDefault();
            const bookId = card.getAttribute('data-book-id');
            fetchBookDetails(bookId); 
        });
    });
}

async function fetchAndDisplayBooks() {
    const genres = ['Fiction', 'Fantasy', 'Romance', 'Horror'];
    for (const genre of genres) {
        const books = await fetchBooksByGenre(genre);
        displayBooks(books, `${genre.toLowerCase()}_books_box`);
    }
}

function stripHtml(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent;
}

async function fetchBookDetails(bookId) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`);
        if (!response.ok) throw new Error('Erro ao carregar os detalhes do livro');

        const bookData = await response.json();
        const bookInfo = bookData.volumeInfo;
        const saleInfo = bookData.saleInfo;

        console.log(bookData);

        document.getElementById('book-title').textContent = bookInfo.title;
        document.getElementById('book-cover').src = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : 'image/default_book.jpg';

        document.getElementById('book-price').textContent = saleInfo && saleInfo.listPrice ? `R$${saleInfo.listPrice.amount}` : 'Preço indisponível';

        document.getElementById('book-pages').textContent = bookInfo.pageCount ? `${bookInfo.pageCount} páginas` : 'Número de páginas desconhecido';
        document.getElementById('book-rating').textContent = bookInfo.averageRating ? `★ ${bookInfo.averageRating}` : 'Sem avaliações';
        document.getElementById('book-description').textContent = stripHtml(bookInfo.description ? bookInfo.description : 'Descrição não disponível');

        document.getElementById('book-details').style.display = 'block';
    } catch (error) {
        console.error(error);
        alert('Não foi possível carregar os detalhes do livro.');
    }
}

document.querySelector('.close').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('book-details').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    const bookDetails = document.getElementById('book-details');

    const cart = document.getElementById('cart');

    document.querySelector('.add_to_cart').addEventListener('click', function() {
        bookDetails.style.display = 'none';
        cart.style.display = 'block';
    });

    document.querySelector('.close').addEventListener('click', function(event) {
        event.preventDefault();
        bookDetails.style.display = 'none';
    });
});

fetchAndDisplayBooks();
