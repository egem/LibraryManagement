import { FindOptions, Identifier } from 'sequelize';

import { User } from 'Services/DatabaseService/Tables/User.model';
import { IUserService } from 'Services/UserService/Interface';

export class UserService implements IUserService {
  async createUser(newUser: Pick<User, 'name'>): Promise<User | null> {
    try {
      const createdUser: User = await User.create(
        {
          name: newUser.name
        }
      );

      return Promise.resolve(createdUser);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async retrieveUserById(
    identifier: Identifier
  ): Promise<User | null> {
    try {
      const user: User | null = await User.findByPk(identifier);

      return Promise.resolve(user);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async retriveUsers(query: FindOptions): Promise<User[]> {
    try {
      const users: User[] = await User.findAll(query);

      return Promise.resolve(users);
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
