import { Router } from 'express';

import { Endpoint } from './Endpoint.enum';
import { router as rootRouter } from './Root';

export const router: Router = Router({ mergeParams: true });

router.use(Endpoint.Root, rootRouter);
