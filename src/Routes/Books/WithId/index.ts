import {
  Request,
  Response,
  Router
} from 'express';

import {
  bookService,
  logService
} from 'Config/Services';

import { Controller } from './Controller';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  bookService,
  logService
);

router.route('')
  .get(
    (req: Request, res: Response) => controller.get(req, res)
  );
