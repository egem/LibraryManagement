import {
  Request,
  Response,
  Router
} from 'express';
import { body } from 'express-validator';

import { Controller } from './Controller';
import { ConsoleLogService } from 'Services/LogService/Console';
import { RequirementsService } from 'Services/RequirementsService/HardCoded';
import { BookService } from 'Services/BookService/Database';
import { ValidationService } from 'Services/ValidationService';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  new BookService(),
  new RequirementsService(),
  new ValidationService(),
  new ConsoleLogService()
);

router.route('')
  .get(
    (req: Request, res: Response) => controller.get(req, res)
  )
  .post(
    [
      body('name')
        .isString().withMessage('Name should be string')
        .notEmpty().withMessage('Name shouldn\'t be empty')
        .trim()
    ],
    (req: Request, res: Response) => controller.post(req, res)
  );
