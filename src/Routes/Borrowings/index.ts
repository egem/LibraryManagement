import { Router } from 'express';

import { Endpoint } from './Endpoint.enum';
import { router as withIdRouter } from './WithId';

export const router: Router = Router({ mergeParams: true });

router.use(Endpoint.WithId, withIdRouter);
