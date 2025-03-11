import { FindOptions, Identifier } from 'sequelize';

import { Book } from 'Services/DatabaseService/Tables/Book.model';
import { IBookService } from 'Services/BookService/Interface';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';

export class BookService implements IBookService {
  async createBook(newBook: Pick<Book, 'name'>): Promise<Book | null> {
    try {
      if (!newBook?.name) {
        throw new InvalidRequest('Name is empty');
      }

      const createdBook: Book = await Book.create(
        {
          name: newBook.name
        }
      );

      return Promise.resolve(createdBook);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async retrieveBookById(
    identifier: Identifier
  ): Promise<Book | null> {
    try {
      const book: Book | null = await Book.findByPk(identifier);

      return Promise.resolve(book);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async retriveBooks(query: FindOptions): Promise<Book[]> {
    try {
      const books: Book[] = await Book.findAll(query);

      return Promise.resolve(books);
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
