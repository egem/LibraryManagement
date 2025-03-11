import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';
import { Op } from 'sequelize';

import { IRequirementsService } from 'Services/RequirementsService/Interface';
import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { errorHandler } from 'Utils/Helpers/Http';
import { ILogService } from 'Services/LogService/Interface';
import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';
import { IBorrowService } from 'Services/BorrowService/Interface';

import { RequestType } from './Models/Post/Request.model';

export class Controller {
  private readonly LogPrefix = 'App:Routes:Users:WithId:Borrowings:Root';

  constructor(
    private readonly borrowService: IBorrowService,
    private readonly requirementsService: IRequirementsService,
    private readonly logService: ILogService
  ) { }

  async get(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void> {
    let userId: number | null = null;

    try {
      const requirements = await this.requirementsService.getRequirements();

      const { query } = req;

      if (!query) {
        throw new InternalError('Request query is null');
      }

      const {
        count,
        page,
        type
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

      const { params } = req;

      if (!params) {
        throw new InternalError('Please check the implementation');
      }

      const {
        userId: userIdStr
      } = params;

      if (!userIdStr) {
        throw new InvalidRequest('User id is wrong');
      }

      userId = +userIdStr;

      let borrowings: Borrow[] = [];

      if (type == RequestType.Past) {
        borrowings = await this.borrowService.retriveBorrowings(
          {
            where: {
              userId,
              returnedAt: {
                [Op.ne]: null
              }
            },
            order: [
              ['id', 'ASC']
            ]
          }
        );
      } else if (type == RequestType.Current) {
        borrowings = await this.borrowService.retriveBorrowings(
          {
            where: {
              returnedAt: null,
              userId
            },
            order: [
              ['id', 'ASC']
            ]
          }
        );
      } else {
        borrowings = await this.borrowService.retriveBorrowings(
          {
            where: {
              userId
            },
            order: [
              ['id', 'ASC']
            ]
          }
        );
      }

      // TODO: Returning only with id values should be considered instead of returning with score
      // However, since it is specified in the requirements, it was implemented to return with a score.
      const result = borrowings.map(
        (borrowing) => (
          {
            id: borrowing.id,
            score: borrowing.score
          }
        )
      );

      res.status(200).send(result);
    } catch (error) {
      const errorMessage = `Error while getting borrowings: ${error}`;

      this.logService.error(this.LogPrefix, errorMessage);

      errorHandler(req, res, error as Error);
    }
  }
}
