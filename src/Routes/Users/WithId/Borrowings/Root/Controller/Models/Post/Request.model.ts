import { User } from 'Services/DatabaseService/Tables/User.model';

export enum RequestType {
  Past = 'Past',
  Current = 'Current',
  All = 'All'
}

export interface Request extends Pick<User, 'name'> {}
