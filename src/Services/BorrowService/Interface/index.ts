import { Identifier } from 'sequelize';

import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';

export interface IBorrowService {
  createBorrow(borrow: Pick<Borrow, 'userId' | 'bookId'>): Promise<Borrow | null>;
  retrieveBorrowById(identifier: Identifier): Promise<Borrow | null>;

  findUserBorrow(userId: number, bookId: number): Promise<Borrow | null>;
}
