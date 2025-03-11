import { Controller } from './index';
import {
  Request as HttpRequest,
  Response as HttpResponse
} from 'express';

// Mocks
const mockUserService = jasmine.createSpyObj('IUserService', ['retriveUsers', 'createUser']);
const mockRequirementsService = jasmine.createSpyObj('IRequirementsService', ['getRequirements']);
const mockValidationService = jasmine.createSpyObj('ValidationService', ['checkUserName']);
const mockLogService = jasmine.createSpyObj('ILogService', ['error']);

describe('Controller', () => {
  let controller: Controller;

  beforeEach(() => {
    controller = new Controller(mockUserService, mockRequirementsService, mockValidationService, mockLogService);
  });

  describe('get method', () => {
    it('should return user IDs when valid query params are provided', async () => {
      const req = { query: { count: '10', page: '1' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({ http: { query: { minPage: 1, minCount: 1, maxCount: 100 }}}));
      mockUserService.retriveUsers.and.returnValue(Promise.resolve([{ id: '1' }, { id: '2' }]));

      await controller.get(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when page value is out of range', async () => {
      const req = { query: { page: '0', count: '10' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({ http: { query: { minPage: 1 }}}));

      await controller.get(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('post method', () => {
    it('should create a user when valid data is provided', async () => {
      const req = { body: { name: 'Name Surname' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      mockRequirementsService.getRequirements.and.returnValue(Promise.resolve({}));
      mockValidationService.checkUserName.and.returnValue(true);
      mockUserService.createUser.and.returnValue(Promise.resolve({ id: '123' }));

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 when name is empty', async () => {
      const req = { body: { name: '' } } as unknown as HttpRequest;
      const res = {
        status: jasmine.createSpy('status').and.returnValue({ send: jasmine.createSpy('send') }),
        send: jasmine.createSpy('send')
      } as unknown as HttpResponse;

      await controller.post(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
