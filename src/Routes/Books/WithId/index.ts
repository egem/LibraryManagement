import {
  Request,
  Response,
  Router
} from 'express';

import { Controller } from './Controller';
import { ConsoleLogService } from 'Services/LogService/Console';
import { RequirementsService } from 'Services/RequirementsService/HardCoded';
import { BookService } from 'Services/BookService/Database';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  new BookService(),
  new RequirementsService(),
  new ConsoleLogService()
);

router.route('')
  .get(
    (req: Request, res: Response) => controller.get(req, res)
  );
