class Book {
  #title: string;
  #author: string;
  #releaseDate: Date;

  constructor(title: string, author: string, releaseDate: Date) {
    this.#title = title;
    this.#author = author;
    this.#releaseDate = releaseDate;
  }

  get title() {
    return this.#title;
  }

  get author() {
    return this.#author;
  }

  get releaseDate() {
    return this.#releaseDate;
  }
}
