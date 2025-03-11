import { Request as HttpRequest, Response as HttpResponse } from 'express';

import { InternalError } from 'Exceptions/InternalError.exception';

import { RequestType } from './Models/Post/Request.model';
import { Controller } from './index';

// Mocks
const mockBorrowService = jasmine.createSpyObj('IBorrowService', ['retriveBorrowings']);
const mockRequirementsService = jasmine.createSpyObj('IRequirementsService', ['getRequirements']);
const mockLogService = jasmine.createSpyObj('ILogService', ['error']);

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(mockBorrowService, mockRequirementsService, mockLogService);
  });

  describe('get method', () => {
    it('should return borrowings for a valid user ID', async () => {
      const req = {
        query: { count: '5', page: '1', type: RequestType.Past },
        params: { userId: '123' }
      } as unknown as HttpRequest;

      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({ http: { query: { minPage: 1, minCount: 1, maxCount: 100 }}}));
      mockBorrowService.retriveBorrowings.and.returnValue(Promise.resolve([{ id: 1, score: 10 }]));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when page is out of range', async () => {
      const req = { query: { page: '0', count: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({ http: { query: { minPage: 1 }}}));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when user ID is missing', async () => {
      const req = { query: { count: '5', page: '1' }, params: {} } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 or 500 in case of internal error', async () => {
      const req = { query: { count: '5', page: '1' }, params: { userId: '123' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.throwError(new InternalError('Test error'));

      await controller.get(req, res);

      if (process.env.NODE_ENV === 'development') {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(res.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
