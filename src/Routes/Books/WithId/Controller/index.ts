import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';

import { Book } from 'Services/DatabaseService/Tables/Book.model';
import { IRequirementsService } from 'Services/RequirementsService/Interface';
import { IBookService } from 'Services/BookService/Interface';
import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { errorHandler } from 'Utils/Helpers/Http';
import { ILogService } from 'Services/LogService/Interface';

export class Controller {
  private readonly LogPrefix = 'App:Routes:Books:WithId';

  constructor(
    private readonly bookService: IBookService,
    private readonly requirementsService: IRequirementsService,
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

      const requirements = await this.requirementsService.getRequirements();

      const { query } = req;

      if (!query) {
        throw new InternalError('Request query is null');
      }

      const {
        count,
        page
      } = query;

      const nPage = page ? +page : 1;
      const nCount = count ? +count : requirements.http.query.maxCount;

      if (nPage < requirements.http.query.minPage) {
        throw new InvalidRequest(
          `Page value is out of range ${nPage}`
        );
      }

      if (
        nCount < requirements.http.query.minCount ||
        nCount > requirements.http.query.maxCount
      ) {
        throw new InvalidRequest(
          `Count value is out of range: ${nCount}`
        );
      }

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
