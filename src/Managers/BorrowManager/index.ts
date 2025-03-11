import { Sequelize } from 'sequelize';

import sequelize from 'Config/Sequelize';
import { Book } from 'Services/DatabaseService/Tables/Book.model';
import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';
import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';

export class BorrowManager {
  async returnBook(
    userId: number,
    bookId: number,
    score: number
  ): Promise<void> {
    try {
      const transaction = await sequelize.transaction();

      try {
        const [updatedRows] = await Borrow.update(
          {
            score,
            returnedAt: new Date()
          },
          {
            where: {
              userId,
              bookId,
              returnedAt: null
            },
            transaction
          }
        );

        if (updatedRows == 0) {
          throw new InvalidRequest('Borrowed book not found');
        }

        const [ incrementedRows ] = await Book.increment(
          {
            totalRating: score,
            ratingCount: 1
          },
          {
            where: {
              id: bookId
            },
            transaction
          }
        );

        if (incrementedRows.length == 0) {
          throw new InvalidRequest('Unable to apply score to book');
        }

        // Update averageRating using sequelize.literal to ensure calculation happens in the DB
        const [ updatedAverageRatingRows ] = await Book.update(
          {
            averageRating: Sequelize.literal('CAST("totalRating" AS FLOAT) / "ratingCount"')
          },
          {
            where: {
              id: bookId
            },
            transaction
          }
        );

        if (updatedAverageRatingRows == 0) {
          throw new InvalidRequest('Average rating could not be updated');
        }

        await transaction.commit();
      } catch (error) {
        await transaction.rollback();

        return Promise.reject(error);
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
