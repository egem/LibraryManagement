import { Controller } from './index';
import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';
import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';

// Mocks
const mockBorrowService = jasmine.createSpyObj('IBorrowService', ['retrieveBorrowById']);
const mockLogService = jasmine.createSpyObj('ILogService', ['log', 'error']);

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(mockBorrowService, mockLogService);
  });

  describe('get method', () => {
    it('should return borrowing details when valid borrowId is provided', async () => {
      const req = { params: { borrowId: '1' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({send: jasmine.createSpy('send')}), // Returning res for method chaining
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      const mockBorrowing: Partial<Borrow> = {
        id: 1,
        userId: 123,
        bookId: 456,
        score: 5,
        borrowedAt: new Date(),
        returnedAt: null
      };
      mockBorrowService.retrieveBorrowById.and.returnValue(Promise.resolve(mockBorrowing));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when borrowId missing', async () => {
      const req = { params: { } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({send: jasmine.createSpy('send')}), // Returning res for method chaining
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when borrowing not found', async () => {
      const req = { params: { borrowId: '1' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({send: jasmine.createSpy('send')}), // Returning res for method chaining
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockBorrowService.retrieveBorrowById.and.returnValue(Promise.resolve(null));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when borrowing not found with exception', async () => {
      const req = { params: { borrowId: '1' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({send: jasmine.createSpy('send')}), // Returning res for method chaining
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockBorrowService.retrieveBorrowById.and.returnValue(Promise.reject(new Error('Not Found')));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 or 500 if an error occurs', async () => {
      const req = { params: { borrowId: '1' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({send: jasmine.createSpy('send')}), // Returning res for method chaining
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      const error = new Error('Some internal error');
      mockBorrowService.retrieveBorrowById.and.throwError(error);

      await controller.get(req, res);

      if (process.env.NODE_ENV === 'development') {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(res.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
