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
  validationService
} from 'Config/Services';

import { Controller } from './Controller';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  bookService,
  requirementsService,
  validationService,
  logService
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
