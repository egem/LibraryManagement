import { Router } from 'express';

import { Endpoint } from './Endpoint.enum';
import { router as booksRouter } from './Books';
import { router as borrowingsRouter } from './Borrowings';
import { router as usersRouter } from './Users';

export const router: Router = Router({ mergeParams: true });

router.use(Endpoint.Books, booksRouter);
router.use(Endpoint.Borrowings, borrowingsRouter);
router.use(Endpoint.Users, usersRouter);
