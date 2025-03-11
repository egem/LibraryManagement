import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';
import { validationResult } from 'express-validator';

import { Book } from 'Services/DatabaseService/Tables/Book.model';
import { IRequirementsService } from 'Services/RequirementsService/Interface';
import { IBookService } from 'Services/BookService/Interface';
import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { errorHandler } from 'Utils/Helpers/Http';
import { ILogService } from 'Services/LogService/Interface';
import { ValidationService } from 'Services/ValidationService';
import { trimAllExtraSpaces } from 'Utils/Helpers/Text';

import { Request as RequestBody } from './Models/Post/Request.model';
import { Response as ResponseBody } from './Models/Post/Response.model';

export class Controller {
  private readonly LogPrefix = 'App:Routes:Books:Root';

  constructor(
    private readonly bookService: IBookService,
    private readonly requirementsService: IRequirementsService,
    private readonly validationService: ValidationService,
    private readonly logService: ILogService
  ) { }

  async get(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void> {
    try {
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

      const books: Pick<Book, 'id'>[] = await this.bookService.retriveBooks(
        {
          limit: nCount,
          offset: (nPage - 1) * nCount,
          attributes: ['id'],
          raw: true,
          order: [
            ['id', 'ASC']
          ]
        }
      );

      const bookIds = books.map(
        (book) => book.id
      );

      res.status(200).send(bookIds);
    } catch (error) {
      const errorMessage = `Error while getting books: ${error}`;

      this.logService.error(this.LogPrefix, errorMessage);

      errorHandler(req, res, error as Error);
    }
  }

  async post(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new InvalidRequest(errors.array().join(' '));
      }

      const requirements = await this.requirementsService.getRequirements();

      const { body } = req;

      if (!body) {
        throw new InternalError('Request body is null');
      }

      let {
        name
      } = body as RequestBody;

      if (!name) {
        throw new InternalError('Name cannot be empty. Please check the implementation');
      }

      name = trimAllExtraSpaces(name);

      if (!this.validationService.checkBookName(name, requirements)) {
        throw new InvalidRequest('Name is not valid');
      }

      const book = await this.bookService.createBook(
        {
          name
        }
      );

      if (!book) {
        throw new InternalError('Book hasn\'t been created');
      }

      const response: ResponseBody = {
        id: book.id
      };

      res.status(201).send(response);
    } catch (error) {
      const errorMessage = `Error while creating book: ${error}`;

      this.logService.error(this.LogPrefix, errorMessage);

      errorHandler(req, res, error as Error);
    }
  }
}
