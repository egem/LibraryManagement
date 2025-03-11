import { FindOptions, Identifier } from 'sequelize';

import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';
import { IBorrowService } from 'Services/BorrowService/Interface';

export class BorrowService implements IBorrowService {
  async createBorrow(borrow: Pick<Borrow, 'userId' | 'bookId'>): Promise<Borrow | null> {
    try {
      const createdBorrow: Borrow = await Borrow.create(
        {
          userId: borrow.userId,
          bookId: borrow.bookId
        }
      );

      return Promise.resolve(createdBorrow);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async retrieveBorrowById(identifier: Identifier): Promise<Borrow | null> {
    try {
      const borrow: Borrow | null = await Borrow.findByPk(identifier);

      return Promise.resolve(borrow);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async retriveBorrowings(query: FindOptions): Promise<Borrow[]> {
    try {
      const borrowings: Borrow[] = await Borrow.findAll(query);

      return Promise.resolve(borrowings);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findUserBorrow(userId: number, bookId: number): Promise<Borrow | null> {
    try {
      const borrow: Borrow | null = await Borrow.findOne({
        where: { userId, bookId }
      });

      return Promise.resolve(borrow);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
