import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';

import { User } from 'Services/DatabaseService/Tables/User.model';
import { IUserService } from 'Services/UserService/Interface';
import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { errorHandler } from 'Utils/Helpers/Http';
import { ILogService } from 'Services/LogService/Interface';
import { IBorrowService } from 'Services/BorrowService/Interface';
import { IBookService } from 'Services/BookService/Interface';
import { Book } from 'Services/DatabaseService/Tables/Book.model';
import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';

import { Response as ResponseBody } from './Models/Post/Response.model';

export class Controller {
  private readonly LogPrefix = 'App:Routes:Users:WithId';

  constructor(
    private readonly userService: IUserService,
    private readonly borrowService: IBorrowService,
    private readonly bookService: IBookService,
    private readonly logService: ILogService
  ) { }

  async post(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void> {
    let userId: number | null = null;
    let bookId: number | null = null;

    try {
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

      const borrow: Borrow | null = await this.borrowService.createBorrow(
        {
          userId,
          bookId
        }
      );

      if (!borrow) {
        throw new InternalError('Borrow hasn\'t been created');
      }

      const response: ResponseBody = {
        id: borrow.id
      };

      res.status(200).send(response);
    } catch (error) {
      const errorMessage = `Error while creating borrow: ${error}`;

      this.logService.error(this.LogPrefix, errorMessage);

      errorHandler(req, res, error as Error);
    }
  }
}
