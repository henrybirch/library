"use strict";
function getBook(id, title, author, publicationDate, isRead) {
    return { id, title, author, publicationDate: publicationDate, isRead };
}
function startBookForm() {
    const overlay = document.getElementById('overlay');
    overlay.className = 'active';
}
function endBookForm() {
    const overlay = document.getElementById('overlay');
    if (!overlay) {
        return;
    }
    overlay.className = 'inactive';
}
function addBookViaEvent(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const title = formData.get('title');
    const author = formData.get('author');
    const date = formData.get('date');
    if (!title || !author || !date) {
        return;
    }
    const dateTyped = new Date(date.toString());
    const mostRecentBookId = getMostRecentBookId();
    addBook(mostRecentBookId !== null ? mostRecentBookId + 1 : 0, title.toString().toUpperCase(), author.toString().toUpperCase(), dateTyped);
}
function getMostRecentBookId() {
    const library = getLibraryFromStorage();
    if (!library) {
        return null;
    }
    const lastBook = library.pop();
    if (!lastBook) {
        return null;
    }
    return lastBook.id;
}
function addBook(id, title, author, releaseDate) {
    const existingLibrary = localStorage.getItem('library');
    const newBook = getBook(id, title, author, releaseDate, null);
    if (!existingLibrary) {
        localStorage.setItem('library', JSON.stringify([newBook]));
    }
    else {
        const typedLibrary = JSON.parse(existingLibrary);
        localStorage.setItem('library', JSON.stringify(typedLibrary.concat([newBook])));
    }
    updateUi();
}
function updateUi() {
    const libraryInStorage = getLibraryFromStorage();
    if (!libraryInStorage) {
        setBookshelf([]);
        return;
    }
    setBookshelf(libraryInStorage);
}
function getTitleDiv(book) {
    const title = document.createElement('div');
    title.textContent = book.title;
    title.classList.add('title');
    return title;
}
function getAuthorDiv(book) {
    const author = document.createElement('div');
    author.textContent = book.author;
    author.classList.add('author');
    return author;
}
function getDateDiv(book) {
    const date = document.createElement('div');
    date.textContent = book.publicationDate
        ? `${book.publicationDate.getFullYear()}-${book.publicationDate.getMonth()}-${book.publicationDate.getDay()}`
        : null;
    date.classList.add('date');
    return date;
}
function getRemoveButton(book) {
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {
        removeBookFromLibrary(book.id);
        updateUi();
    });
    return removeButton;
}
function getReadButton(book) {
    const readButton = document.createElement('button');
    readButton.className = 'read-button';
    readButton.textContent = book.isRead ? 'Read? ✓' : 'Read? x';
    readButton.addEventListener('click', () => {
        changeReadStatus(book.id);
        updateUi();
    });
    return readButton;
}
function getBookElement(book) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.setAttribute('data-book-id', book.id.toString());
    [
        getTitleDiv(book),
        getAuthorDiv(book),
        getDateDiv(book),
        getRemoveButton(book),
        getReadButton(book),
    ].forEach(el => {
        bookElement.appendChild(el);
    });
    return bookElement;
}
function changeReadStatus(bookId) {
    const library = getLibraryFromStorage();
    if (!library) {
        return;
    }
    const book = library.find(book => book.id === bookId);
    if (!book) {
        return;
    }
    console.log('asdfsadfsdaf');
    const newStatus = !book.isRead;
    const newLibrary = [
        ...library.filter(book => book.id < bookId),
        getBook(bookId, book.title, book.author, book.publicationDate, newStatus),
        ...library.filter(book => book.id > bookId),
    ];
    setLibraryInStorage(newLibrary);
}
function removeBookFromLibrary(id) {
    const currentLibrary = getLibraryFromStorage();
    if (!currentLibrary) {
        return;
    }
    setLibraryInStorage(currentLibrary.filter(book => book.id != id));
}
function getBookshelf(library) {
    const newBookshelf = document.createElement('div');
    newBookshelf.id = 'bookshelf';
    library.forEach(book => {
        newBookshelf.appendChild(getBookElement(book));
    });
    const addBookButton = document.createElement('button');
    addBookButton.addEventListener('click', startBookForm);
    addBookButton.className = 'add-book-button';
    const plusSign = document.createElement('span');
    plusSign.className = 'inside-button';
    plusSign.textContent = '+';
    addBookButton.appendChild(plusSign);
    newBookshelf.appendChild(addBookButton);
    return newBookshelf;
}
function setBookshelf(library) {
    const existingBookshelf = document.getElementById('bookshelf');
    if (existingBookshelf) {
        existingBookshelf.remove();
    }
    const newBookshelf = getBookshelf(library);
    document.body.appendChild(newBookshelf);
}
function addEndBookFormToOverlay() {
    const overlay = document.getElementById('overlay');
    if (!overlay) {
        return;
    }
    overlay.addEventListener('click', function (event) {
        if (event.target !== this) {
            return;
        }
        endBookForm();
    });
}
function addFormEventListener() {
    const form = document.getElementById('book-form');
    form === null || form === void 0 ? void 0 : form.addEventListener('submit', e => {
        addBookViaEvent(e);
        endBookForm();
    });
}
function getLibraryFromStorage() {
    const library = localStorage.getItem('library');
    if (!library) {
        return null;
    }
    function reviver(key, value) {
        if (key === 'publicationDate') {
            return new Date(value);
        }
        return value;
    }
    return JSON.parse(library, reviver);
}
function setLibraryInStorage(library) {
    localStorage.setItem('library', JSON.stringify(library));
}
addEndBookFormToOverlay();
updateUi();
addFormEventListener();
getLibraryFromStorage();
