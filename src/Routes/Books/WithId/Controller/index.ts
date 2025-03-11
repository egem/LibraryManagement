import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';

import { Book } from 'Services/DatabaseService/Tables/Book.model';
import { IBookService } from 'Services/BookService/Interface';
import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { errorHandler } from 'Utils/Helpers/Http';
import { ILogService } from 'Services/LogService/Interface';

export class Controller {
  private readonly LogPrefix = 'App:Routes:Books:WithId';

  constructor(
    private readonly bookService: IBookService,
    private readonly logService: ILogService
  ) { }

  async get(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void> {
    let bookId: number | undefined;

    try {
      const { params } = req;

      if (!params) {
        throw new InternalError('Please check the implementation');
      }

      const { bookId: bookIdStr } = params;

      if (!bookIdStr) {
        throw new InvalidRequest('Id is wrong');
      }

      bookId = +bookIdStr;

      const book: Book | null = await this.bookService.retrieveBookById(bookId);

      if (!book) {
        throw new InvalidRequest('Book not found');
      }

      res.status(200).send(book);
    } catch (error) {
      const errorMessage = `Error while getting book with id: ${bookId} ${error}`;

      this.logService.error(this.LogPrefix, errorMessage);

      errorHandler(req, res, error as Error);
    }
  }
}
