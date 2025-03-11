import {
  Request,
  Response,
  Router
} from 'express';

import {
  logService,
  requirementsService,
  userService
} from 'Config/Services';

import { Controller } from './Controller';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  userService,
  requirementsService,
  logService
);

router.route('')
  .get(
    (req: Request, res: Response) => controller.get(req, res)
  );
