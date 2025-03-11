import {
  Request,
  Response,
  Router
} from 'express';
import { body } from 'express-validator';

import {
  bookService,
  logService,
  requirementsService,
  userService,
  validationService
} from 'Config/Services';
import { borrowManager } from 'Config/Managers';

import { Controller } from './Controller';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  userService,
  bookService,
  validationService,
  requirementsService,
  logService,
  borrowManager
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
