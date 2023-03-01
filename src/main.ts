type Book = {title: string; author: string; releaseDate: Date};
type Library = Array<Book>;

function getBook(title: string, author: string, releaseDate: Date): Book {
  return {title, author, releaseDate};
}
