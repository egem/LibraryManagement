import { Request as HttpRequest, Response as HttpResponse } from 'express';

import { Controller } from './index';

// Mocks
const mockUserService = jasmine.createSpyObj('IUserService', ['retrieveUserById']);
const mockBorrowService = jasmine.createSpyObj('IBorrowService', ['createBorrow']);
const mockBookService = jasmine.createSpyObj('IBookService', ['retrieveBookById']);
const mockLogService = jasmine.createSpyObj('ILogService', ['error']);

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(mockUserService, mockBorrowService, mockBookService, mockLogService);
  });

  describe('post method', () => {
    it('should successfully create a borrow record and return 200', async () => {
      const req = { params: { userId: '1', bookId: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.resolve({ id: 1 }));
      mockBookService.retrieveBookById.and.returnValue(Promise.resolve({ id: 10 }));
      mockBorrowService.createBorrow.and.returnValue(Promise.resolve({ id: 100 }));

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if userId is missing', async () => {
      const req = { params: { bookId: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      await controller.post(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if bookId is missing', async () => {
      const req = { params: { userId: '1' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      await controller.post(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if user does not exist', async () => {
      const req = { params: { userId: '1', bookId: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.resolve(null));

      await controller.post(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if user does not exist with exception', async () => {
      const req = { params: { userId: '1', bookId: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.reject(new Error('Not found')));

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if book does not exist', async () => {
      const req = { params: { userId: '1', bookId: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.resolve({ id: 1 }));
      mockBookService.retrieveBookById.and.returnValue(Promise.resolve(null));

      await controller.post(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if book does not exist with exception', async () => {
      const req = { params: { userId: '1', bookId: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.resolve({ id: 1 }));
      mockBookService.retrieveBookById.and.returnValue(Promise.reject(new Error('Not found')));

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 500 if borrow creation fails', async () => {
      const req = { params: { userId: '1', bookId: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.resolve({ id: 1 }));
      mockBookService.retrieveBookById.and.returnValue(Promise.resolve({ id: 10 }));
      mockBorrowService.createBorrow.and.returnValue(Promise.resolve(null));

      await controller.post(req, res);

      if (process.env.NODE_ENV === 'development') {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(res.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
