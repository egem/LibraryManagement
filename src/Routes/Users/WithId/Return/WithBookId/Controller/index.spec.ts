import { Request as HttpRequest, Response as HttpResponse } from 'express';

import { InternalError } from 'Exceptions/InternalError.exception';

import { Controller } from './index';

// Mocks
const mockUserService = jasmine.createSpyObj('IUserService', ['retrieveUserById']);
const mockBookService = jasmine.createSpyObj('IBookService', ['retrieveBookById']);
const mockValidationService = jasmine.createSpyObj('ValidationService', ['checkBookScore']);
const mockRequirementsService = jasmine.createSpyObj('IRequirementsService', ['getRequirements']);
const mockLogService = jasmine.createSpyObj('ILogService', ['error']);
const mockBorrowManager = jasmine.createSpyObj('BorrowManager', ['returnBook']);

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(
      mockUserService,
      mockBookService,
      mockValidationService,
      mockRequirementsService,
      mockLogService,
      mockBorrowManager
    );
  });

  describe('post method', () => {
    it('should return 200 if the book is successfully returned', async () => {
      const req = {
        body: { score: 5 },
        params: { userId: '1', bookId: '100' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockValidationService.checkBookScore.and.returnValue(true);
      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({ }));
      mockUserService.retrieveUserById.and.returnValue(Promise.resolve({ id: 1 }));
      mockBookService.retrieveBookById.and.returnValue(Promise.resolve({ id: 100 }));
      mockBorrowManager.returnBook.and.returnValue(Promise.resolve());

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when validation fails', async () => {
      const req = {
        body: { score: null },
        params: { userId: '1', bookId: '100' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({}));
      mockUserService.retrieveUserById.and.returnValue(Promise.resolve({ id: 1 }));
      mockBookService.retrieveBookById.and.returnValue(Promise.resolve({ id: 100 }));

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when user is not found', async () => {
      const req = {
        body: { score: 5 },
        params: { userId: '1', bookId: '100' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({}));
      mockUserService.retrieveUserById.and.returnValue(Promise.resolve(null)); // User not found

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when book is not found', async () => {
      const req = {
        body: { score: 5 },
        params: { userId: '1', bookId: '100' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({}));
      mockUserService.retrieveUserById.and.returnValue(Promise.resolve({ id: 1 }));
      mockBookService.retrieveBookById.and.returnValue(Promise.resolve(null)); // Book not found

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 or 500 in case of internal error', async () => {
      const req = {
        body: { score: 5 },
        params: { userId: '1', bookId: '100' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.throwError(new InternalError('Test error'));

      await controller.post(req, res);

      if (process.env.NODE_ENV === 'development') {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(res.status).toHaveBeenCalledWith(400);
      }
    });

    it('should log and handle unexpected errors', async () => {
      const req = {
        body: { score: 5 },
        params: { userId: '1', bookId: '100' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.throwError(new Error('Unexpected error'));

      await controller.post(req, res);

      if (process.env.NODE_ENV === 'development') {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(res.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
