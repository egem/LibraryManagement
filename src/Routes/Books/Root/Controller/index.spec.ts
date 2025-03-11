import { Controller } from './index';
import { Request as HttpRequest, Response as HttpResponse } from 'express';

// Mocks
const mockBookService = jasmine.createSpyObj('IBookService', ['retriveBooks', 'createBook']);
const mockRequirementsService = jasmine.createSpyObj('IRequirementsService', ['getRequirements']);
const mockValidationService = jasmine.createSpyObj('ValidationService', ['checkBookName']);
const mockLogService = jasmine.createSpyObj('ILogService', ['error']);

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(
      mockBookService,
      mockRequirementsService,
      mockValidationService,
      mockLogService
    );
  });

  describe('get method', () => {
    it('should return book ids when valid query params are provided', async () => {
      const sendSpy = jasmine.createSpy('send');
      const req = { query: { page: '1', count: '5' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({ http: { query: { maxCount: 10, minPage: 1, minCount: 1 } } }));
      mockBookService.retriveBooks.and.returnValue(Promise.resolve([{ id: 1 }, { id: 2 }]));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(sendSpy).toHaveBeenCalledWith([1, 2]);
    });

    it('should return 400 error for invalid page value', async () => {
      const sendSpy = jasmine.createSpy('send');
      const req = { query: { page: '0', count: '5' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({ http: { query: { maxCount: 10, minPage: 1, minCount: 1 } } }));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 or 500 if an error occurs', async () => {
      const sendSpy = jasmine.createSpy('send');
      const req = { query: { page: '1', count: '5' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      const error = new Error('Some internal error');
      mockRequirementsService.getRequirements.and.throwError(error);

      await controller.get(req, res);

      if (process.env.NODE_ENV === 'development') {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(res.status).toHaveBeenCalledWith(400);
      }
    });
  });

  describe('post method', () => {
    it('should create a book and return id', async () => {
      const sendSpy = jasmine.createSpy('send');
      const req = { body: { name: 'New Book' } } as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({}));
      mockValidationService.checkBookName.and.returnValue(true);
      mockBookService.createBook.and.returnValue(Promise.resolve({ id: 1 }));

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(sendSpy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return 400 if name is missing', async () => {
      const sendSpy = jasmine.createSpy('send');
      const req = { body: {} } as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if validation fails', async () => {
      const sendSpy = jasmine.createSpy('send');
      const req = { body: { name: 'Invalid Name' } } as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: sendSpy })
      } as unknown as HttpResponse;

      mockValidationService.checkBookName.and.returnValue(false);

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
