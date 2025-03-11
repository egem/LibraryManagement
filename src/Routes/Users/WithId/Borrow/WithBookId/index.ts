import {
  Request,
  Response,
  Router
} from 'express';

import { Controller } from './Controller';
import { UserService } from 'Services/UserService/Database';
import { ConsoleLogService } from 'Services/LogService/Console';
import { BorrowService } from 'Services/BorrowService/Database';
import { BookService } from 'Services/BookService/Database';

export const router: Router = Router({ mergeParams: true });

const controller = new Controller(
  new UserService(),
  new BorrowService(),
  new BookService(),
  new ConsoleLogService()
);

router.route('')
  .post(
    (req: Request, res: Response) => controller.post(req, res)
  );
