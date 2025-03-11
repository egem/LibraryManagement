import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';
import { validationResult } from 'express-validator';

import { User } from 'Services/DatabaseService/Tables/User.model';
import { IUserService } from 'Services/UserService/Interface';
import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { errorHandler } from 'Utils/Helpers/Http';
import { ILogService } from 'Services/LogService/Interface';
import { IBookService } from 'Services/BookService/Interface';
import { ValidationService } from 'Services/ValidationService';
import { RequirementsService } from 'Services/RequirementsService/HardCoded';
import { Book } from 'Services/DatabaseService/Tables/Book.model';
import { BorrowManager } from 'Managers/BorrowManager';

import { Request as RequestBody } from './Models/Post/Request.model';

export class Controller {
  private readonly LogPrefix = 'App:Routes:Users:WithId';

  constructor(
    private readonly userService: IUserService,
    private readonly bookService: IBookService,
    private readonly validationService: ValidationService,
    private readonly requirementsService: RequirementsService,
    private readonly logService: ILogService,
    private readonly borrowManager: BorrowManager
  ) { }

  async post(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void> {
    let userId: number | null = null;
    let bookId: number | null = null;

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

      const {
        score
      } = body as RequestBody;

      if (
        (score == null) ||
        (!this.validationService.checkBookScore(score, requirements))
      ) {
        throw new InvalidRequest('Invalid score!');
      }

      const { params } = req;

      if (!params) {
        throw new InternalError('Please check the implementation');
      }

      const {
        userId: userIdStr,
        bookId: bookIdStr
      } = params;

      if (!userIdStr) {
        throw new InvalidRequest('User id is wrong');
      }

      if (!bookIdStr) {
        throw new InvalidRequest('Book id is wrong');
      }

      userId = +userIdStr;
      bookId = +bookIdStr;

      const user: User | null = await this.userService.retrieveUserById(
        userId
      );

      if (!user) {
        throw new InvalidRequest('User id not match with any user');
      }

      const book: Book | null = await this.bookService.retrieveBookById(
        bookId
      );

      if (!book) {
        throw new InvalidRequest('Book id not match with any book');
      }

      await this.borrowManager.returnBook(userId, bookId, score);

      res.status(201).send();
    } catch (error) {
      const errorMessage = `Error while creating borrow: ${error}`;

      this.logService.error(this.LogPrefix, errorMessage);

      errorHandler(req, res, error as Error);
    }
  }
}
