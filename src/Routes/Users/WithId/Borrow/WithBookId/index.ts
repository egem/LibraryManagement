import {
  Request,
  Response,
  Router
} from 'express';

import {
  bookService,
  borrowService,
  logService,
  userService
} from 'Config/Services';

import { Controller } from './Controller';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  userService,
  borrowService,
  bookService,
  logService
);

router.route('')
  .post(
    (req: Request, res: Response) => controller.post(req, res)
  );
