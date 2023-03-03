type Book = {
  id: number;
  title: string;
  author: string;
  publicationDate: Date | null;
  isRead: null | boolean;
};
type Library = Array<Book>;

function getBook(
  id: number,
  title: string,
  author: string,
  releaseDate: Date | null,
  isRead: null | boolean
): Book {
  return {id, title, author, publicationDate: releaseDate, isRead};
}

function startBookForm() {
  const overlay: HTMLElement | null = document.getElementById('overlay');
  overlay!.className = 'active';
}

function endBookForm() {
  const overlay: HTMLElement | null = document.getElementById('overlay');
  if (!overlay) {
    return;
  }
  overlay.className = 'inactive';
}

function addBookViaEvent(event: SubmitEvent) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;

  const formData = new FormData(form);
  const title = formData.get('title');
  const author = formData.get('author');
  const date = formData.get('date');
  if (!title || !author || !date) {
    return;
  }

  const dateTyped = new Date(date.toString());
  const mostRecentBookId = getMostRecentBookId();
  addBook(
    mostRecentBookId !== null ? mostRecentBookId + 1 : 0,
    title.toString(),
    author.toString(),
    dateTyped
  );
}

function getMostRecentBookId(): null | number {
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

function addBook(
  id: number,
  title: string,
  author: string,
  releaseDate: null | Date
) {
  const existingLibrary = localStorage.getItem('library');
  const newBook = getBook(id, title, author, releaseDate, null);
  if (!existingLibrary) {
    localStorage.setItem('library', JSON.stringify([newBook]));
  } else {
    const typedLibrary: Library = JSON.parse(existingLibrary);
    localStorage.setItem(
      'library',
      JSON.stringify(typedLibrary.concat([newBook]))
    );
  }
  updateUi();
}

function updateUi() {
  const libraryInStorage = getLibraryFromStorage();
  if (!libraryInStorage) {
    setBookshelf([]);
    return;
  }
  libraryInStorage.forEach(book => console.log(book.publicationDate));
  setBookshelf(libraryInStorage);
}

function getBookElement(book: Book) {
  const bookElement = document.createElement('div');
  bookElement.classList.add('book');
  bookElement.setAttribute('data-book-id', book.id.toString());

  const title = document.createElement('div');
  title.textContent = book.title;
  title.classList.add('title');

  const author = document.createElement('div');
  author.textContent = book.author;
  author.classList.add('author');

  const date = document.createElement('div');
  date.textContent = book.publicationDate
    ? `${book.publicationDate.getFullYear()}-${book.publicationDate.getMonth()}-${book.publicationDate.getDay()}`
    : null;
  date.classList.add('date');

  [title, author, date].forEach(el => {
    bookElement.appendChild(el);
  });

  const removeButton = document.createElement('button');
  removeButton.className = 'remove-button';
  removeButton.textContent = 'X';
  removeButton.addEventListener('click', () => {
    removeBookFromLibrary(book.id);
    updateUi();
  });
  bookElement.appendChild(removeButton);
  return bookElement;
}

function removeBookFromLibrary(id: number) {
  const currentLibrary = getLibraryFromStorage();
  if (!currentLibrary) {
    return;
  }
  setLibraryInStorage(currentLibrary.filter(book => book.id != id));
}

function getBookshelf(library: Library) {
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

function setBookshelf(library: Library) {
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
  overlay.addEventListener('click', function (this, event) {
    if (event.target !== this) {
      return;
    }
    endBookForm();
  });
}

function addFormEventListener() {
  const form = document.getElementById('book-form');
  form?.addEventListener('submit', e => {
    addBookViaEvent(e);
    endBookForm();
  });
}

function getLibraryFromStorage(): Library | null {
  const library = localStorage.getItem('library');
  if (!library) {
    return null;
  }

  function reviver(key: string, value: string) {
    if (key === 'publicationDate') {
      return new Date(value);
    }
    return value;
  }

  return JSON.parse(library, reviver);
}

function setLibraryInStorage(library: Library) {
  localStorage.setItem('library', JSON.stringify(library));
}

addEndBookFormToOverlay();
updateUi();
addFormEventListener();
getLibraryFromStorage();
