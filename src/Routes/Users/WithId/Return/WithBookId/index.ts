import {
  Request,
  Response,
  Router
} from 'express';
import { body } from 'express-validator';

import { Controller } from './Controller';
import { UserService } from 'Services/UserService/Database';
import { ConsoleLogService } from 'Services/LogService/Console';
import { BookService } from 'Services/BookService/Database';
import { ValidationService } from 'Services/ValidationService';
import { RequirementsService } from 'Services/RequirementsService/HardCoded';
import { BorrowManager } from 'Managers/BorrowManager';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  new UserService(),
  new BookService(),
  new ValidationService(),
  new RequirementsService(),
  new ConsoleLogService(),
  new BorrowManager()
);

router.route('')
  .post(
    [
      body('score')
        .isNumeric().withMessage('Score must be a number')
        .isInt().withMessage('Score must be integer')
    ],
    (req: Request, res: Response) => controller.post(req, res)
  );
