import { InternalError } from 'Exceptions/InternalError.exception';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';

export const errorHandler = (req: HttpRequest, res: HttpResponse, error: Error) => {
  if (error instanceof InvalidRequest) {
    res.status(400).send(error.message);
  } else if (error instanceof InternalError) {
    if (process.env.NODE_ENV !== 'development') {
      res.status(400).send();
    } else {
      res.status(500).send(error.message);
    }
  } else if (
    process.env.NODE_ENV !== 'development'
  ) {
    res.status(400).send();
  } else {
    res.status(501).send(error.message);
  }
}
