import { Requirements } from 'Models/Requirements.model';

export interface IRequirementsService {
  getRequirements(): Promise<Requirements>;
}
