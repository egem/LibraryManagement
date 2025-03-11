import { Router } from 'express';

import { Endpoint } from './Endpoint.enum';
import { router as rootRouter } from './Root';
import { router as withIdRouter } from './WithId';

export const router: Router = Router({ mergeParams: true });

router.use(Endpoint.Root, rootRouter);
router.use(Endpoint.WithId, withIdRouter);
