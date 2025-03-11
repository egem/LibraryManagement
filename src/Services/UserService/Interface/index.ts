import { FindOptions, Identifier } from 'sequelize';

import { User } from 'Services/DatabaseService/Tables/User.model';

export interface IUserService {
  createUser(user: Pick<User, 'name'>): Promise<User | null>;
  retrieveUserById(identifier: Identifier): Promise<User | null>;
  retriveUsers(query: FindOptions): Promise<User[]>;
}
