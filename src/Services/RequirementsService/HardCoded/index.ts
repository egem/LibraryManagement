import { Requirements } from 'Models/Requirements.model';
import { IRequirementsService } from 'Services/RequirementsService/Interface';

export const requirements: Requirements = {
  http: {
    query: {
      minCount: 0,
      maxCount: 30,
      minPage: 0
    }
  },
  user: {
    name: {
      maxLength: 100
    }
  },
  book: {
    name: {
      maxLength: 255
    },
    score: {
      min: 0,
      max: 10
    }
  }
};

export class RequirementsService implements IRequirementsService {
  getRequirements(): Promise<Requirements> {
    return Promise.resolve(requirements);
  }
}
