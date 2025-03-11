import {
  Request,
  Response,
  Router
} from 'express';

import {
  borrowService,
  logService,
  requirementsService
} from 'Config/Services';

import { Controller } from './Controller';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  borrowService,
  requirementsService,
  logService
);

router.route('')
  .get(
    (req: Request, res: Response) => controller.get(req, res)
  );
