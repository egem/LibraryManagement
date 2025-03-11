import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';

import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { errorHandler } from 'Utils/Helpers/Http';
import { ILogService } from 'Services/LogService/Interface';
import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';
import { IBorrowService } from 'Services/BorrowService/Interface';

import { Response as ResponseBody } from './Models/Get/Response.model';

export class Controller {
  private readonly LogPrefix = 'App:Routes:Users:WithId:Borrowings:Root';

  constructor(
    private readonly borrowService: IBorrowService,
    private readonly logService: ILogService
  ) { }

  async get(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void> {
    let borrowId: number | null = null;

    try {
      const { params } = req;

      if (!params) {
        throw new InternalError('Please check the implementation');
      }

      const {
        borrowId: borrowIdStr
      } = params;

      if (!borrowIdStr) {
        throw new InvalidRequest('Borrow id is wrong');
      }

      borrowId = +borrowIdStr;

      const borrowing: Borrow | null = await this.borrowService.retrieveBorrowById(borrowId);

      if (!borrowing) {
        throw new InvalidRequest('Borrowing not found');
      }

      const response: ResponseBody = {
        id: borrowing.id,
        userId: borrowing.userId,
        bookId: borrowing.bookId,
        score: borrowing.score,
        borrowedAt: borrowing.borrowedAt,
        returnedAt: borrowing.returnedAt
      };

      res.status(200).send(response);
    } catch (error) {
      const errorMessage = `Error while getting borrowing with id ${borrowId}: ${error}`;

      this.logService.error(this.LogPrefix, errorMessage);

      errorHandler(req, res, error as Error);
    }
  }
}
