// models/Book.ts
import { CreateOptions, DataTypes, InstanceUpdateOptions, Model } from 'sequelize';

import sequelize from 'Config/Sequelize';
import { TableName } from 'Services/DatabaseService/Enums/TableName.enum';
import { User } from './User.model';
import { Book } from './Book.model';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';

export class Borrow extends Model {
  public id!: number;
  public userId!: number;
  public bookId!: number;
  public score!: number | null;
  public borrewedAt!: Date;
  public returnedAt!: Date | null;
}

Borrow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      },
      allowNull: false
    },
    bookId: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: 'id'
      },
      allowNull: false
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrowedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    returnedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: TableName.Borrowings,
    timestamps: false,
    indexes: [
      {
        fields: ['userId'] // Index for searching by userId
      },
      {
        unique: true,
        fields: ['bookId', 'returnedAt'] // Index for searching by bookId
      },
      {
        fields: ['userId', 'bookId'] // Composite index
      }
    ],
    hooks: {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      async beforeCreate(borrowing: Borrow, __options: CreateOptions<any>) {
        const existingBorrowing = await Borrow.findOne({
          where: {
            bookId: borrowing.bookId,
            returnedAt: null
          }
        });

        if (existingBorrowing) {
          throw new InvalidRequest(
            'This book has already been borrowed.'
          );
        }
      },

      /* eslint-disable  @typescript-eslint/no-explicit-any */
      async beforeUpdate(borrowing: Borrow, __options: InstanceUpdateOptions<any>) {
        if (borrowing.returnedAt) {
          // Ensure that `returnedAt` is being set (i.e., it's a return operation)
          const existingBorrowing = await Borrow.findOne({
            where: {
              userId: borrowing.userId,
              bookId: borrowing.bookId,
              returnedAt: null
            }
          });

          if (!existingBorrowing) {
            throw new Error(
              'No active borrowing found for this book to return.'
            );
          }
        }
      }
    }
  }
);
