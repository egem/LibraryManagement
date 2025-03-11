import { Controller } from './index';
import { Request as HttpRequest, Response as HttpResponse } from 'express';
import { Book } from 'Services/DatabaseService/Tables/Book.model';

// Mocks
const mockBookService = jasmine.createSpyObj('IBookService', ['retrieveBookById']);
const mockLogService = jasmine.createSpyObj('ILogService', ['error']);

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(mockBookService, mockLogService);
  });

  describe('get method', () => {
    it('should return book details when valid bookId is provided', async () => {
      const req = { params: { bookId: '1' } } as unknown as HttpRequest;

      // Declare and initialize the res object first
      const res = {
        status: jasmine.createSpy('status').and.returnValue({send: jasmine.createSpy('send')}), // Returning res for method chaining
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      const mockBook: Partial<Book> = { id: 1, name: 'Test Book' };
      mockBookService.retrieveBookById.and.returnValue(Promise.resolve(mockBook));

      // Now call the controller's get method
      await controller.get(req, res);

      // Expect that status was called with 200
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if bookId is missing', async () => {
      const req = { params: {} } as unknown as HttpRequest;
      const sendSpy = jasmine.createSpy('send');
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if book not found', async () => {
      const req = { params: { bookId: '1' } } as unknown as HttpRequest;
      const sendSpy = jasmine.createSpy('send');
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      mockBookService.retrieveBookById.and.returnValue(Promise.resolve(null));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 or 500 if an internal error occurs', async () => {
      const req = { params: { bookId: '1' } } as unknown as HttpRequest;
      const sendSpy = jasmine.createSpy('send');
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      const error = new Error('Some internal error');
      mockBookService.retrieveBookById.and.throwError(error);

      await controller.get(req, res);

      if (process.env.NODE_ENV === 'development') {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(res.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
