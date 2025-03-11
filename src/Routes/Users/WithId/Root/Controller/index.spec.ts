import { Request as HttpRequest, Response as HttpResponse } from 'express';

import { InternalError } from 'Exceptions/InternalError.exception';
import { User } from 'Services/DatabaseService/Tables/User.model';

import { Controller } from './index';

// Mocks
const mockUserService = jasmine.createSpyObj('IUserService', ['retrieveUserById']);
const mockRequirementsService = jasmine.createSpyObj('IRequirementsService', ['getRequirements']);
const mockLogService = jasmine.createSpyObj('ILogService', ['error']);

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(mockUserService, mockRequirementsService, mockLogService);
  });

  describe('get method', () => {
    it('should return the user details for a valid user ID', async () => {
      const req = {
        params: { userId: '123' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.resolve({ id: 123, name: 'Test User' } as User));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when the user ID is missing from params', async () => {
      const req = {
        params: {}
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when user is not found', async () => {
      const req = {
        params: { userId: '123' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.resolve(null)); // User not found

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 when user is not found with exception', async () => {
      const req = {
        params: { userId: '123' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.returnValue(Promise.reject(new Error('Not Found'))); // User not found

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 or 500 in case internal error', async () => {
      const req = {
        params: { userId: '123' }
      } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockUserService.retrieveUserById.and.throwError(new InternalError('Test error'));

      await controller.get(req, res);

      if (process.env.NODE_ENV === 'development') {
        expect(res.status).toHaveBeenCalledWith(500);
      } else {
        expect(res.status).toHaveBeenCalledWith(400);
      }
    });
  });
});
