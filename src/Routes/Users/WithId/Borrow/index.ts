import { Router } from 'express';

import { Endpoint } from './Endpoint.enum';
import { router as withBookIdRouter } from './WithBookId';

export const router: Router = Router({ mergeParams: true });

router.use(Endpoint.WithBookId, withBookIdRouter);
