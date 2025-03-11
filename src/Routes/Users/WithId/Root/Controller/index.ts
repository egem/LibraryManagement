import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';

import { User } from 'Services/DatabaseService/Tables/User.model';
import { IRequirementsService } from 'Services/RequirementsService/Interface';
import { IUserService } from 'Services/UserService/Interface';
import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { errorHandler } from 'Utils/Helpers/Http';
import { ILogService } from 'Services/LogService/Interface';

export class Controller {
  private readonly LogPrefix = 'App:Routes:Users:WithId';

  constructor(
    private readonly userService: IUserService,
    private readonly requirementsService: IRequirementsService,
    private readonly logService: ILogService
  ) { }

  async get(
    req: HttpRequest,
    res: HttpResponse
  ): Promise<void> {
    let userId: number | undefined;

    try {
      const { params } = req;

      if (!params) {
        throw new InternalError('Please check the implementation');
      }

      const { userId: userIdStr } = params;

      if (!userIdStr) {
        throw new InvalidRequest('Id is wrong');
      }

      userId = +userIdStr;

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

      const user: User | null = await this.userService.retrieveUserById(userId);

      if (!user) {
        throw new InvalidRequest('User not found');
      }

      res.status(200).send(user);
    } catch (error) {
      const errorMessage = `Error while getting user with id: ${userId} ${error}`;

      this.logService.error(this.LogPrefix, errorMessage);

      errorHandler(req, res, error as Error);
    }
  }
}
