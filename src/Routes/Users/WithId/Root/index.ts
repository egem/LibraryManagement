import {
  Request,
  Response,
  Router
} from 'express';

import { Controller } from './Controller';
import { UserService } from 'Services/UserService/Database';
import { ConsoleLogService } from 'Services/LogService/Console';
import { RequirementsService } from 'Services/RequirementsService/HardCoded';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  new UserService(),
  new RequirementsService(),
  new ConsoleLogService()
);

router.route('')
  .get(
    (req: Request, res: Response) => controller.get(req, res)
  );
