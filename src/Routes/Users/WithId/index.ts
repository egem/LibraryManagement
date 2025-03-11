import { Router } from 'express';

import { Endpoint } from './Endpoint.enum';
import { router as borrowRouter } from './Borrow';
import { router as returnRouter } from './Return';
import { router as rootRouter } from './Root';

export const router: Router = Router({ mergeParams: true });

router.use(Endpoint.Borrow, borrowRouter);
router.use(Endpoint.Return, returnRouter);
router.use(Endpoint.Root, rootRouter);
