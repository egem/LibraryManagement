import { FindOptions, Identifier } from 'sequelize';

import { Book } from 'Services/DatabaseService/Tables/Book.model';

export interface IBookService {
  createBook(user: Pick<Book, 'name'>): Promise<Book | null>;
  retrieveBookById(identifier: Identifier): Promise<Book | null>;
  retriveBooks(query: FindOptions): Promise<Book[]>;
}
