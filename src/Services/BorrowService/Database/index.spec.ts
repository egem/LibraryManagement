import { BorrowService } from 'Services/BorrowService/Database';
import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';

describe('BorrowService', () => {
  let borrowService: BorrowService;

  beforeEach(() => {
    borrowService = new BorrowService();
  });

  it('should create a new borrowings', async () => {
    // Arrange
    const createSpy = spyOn(Borrow, 'create').and.returnValue(Promise.resolve({
      userId: 1,
      bookId: 2
    }));

    const newBorrow = {
      userId: 1,
      bookId: 2
    };

    // Act
    const createdBorrow = await borrowService.createBorrow(newBorrow);

    // Assert
    expect(createdBorrow).toBeDefined();
    expect(createdBorrow?.userId).toBe(newBorrow.userId);
    expect(createdBorrow?.bookId).toBe(newBorrow.bookId);
    expect(createSpy).toHaveBeenCalledWith(newBorrow);
  });

  it('should retrieve a borrowing by ID', async () => {
    const borrowId: number = 1;

    // Arrange
    const findByPkSpy = spyOn(Borrow, 'findByPk').and.returnValue(
      Promise.resolve(
        {
          id: borrowId
        } as Borrow
      )
    );

    // Act
    const borrow = await borrowService.retrieveBorrowById(borrowId);

    // Assert
    expect(borrow).toBeDefined();
    expect(borrow?.id).toBe(borrowId);
    expect(findByPkSpy).toHaveBeenCalledWith(borrowId);
  });

  it('should find user borrow', async () => {
    const borrowId = 1;
    const userId = 2;
    const bookId = 3;

    // Arrange
    spyOn(Borrow, 'findOne').and.returnValue(
      Promise.resolve(
        {
          id: borrowId,
          userId,
          bookId
        } as Borrow
      )
    );

    // Act
    const borrow = await borrowService.findUserBorrow(userId, bookId);

    // Assert
    expect(borrow).toBeDefined();
    expect(borrow?.id).toBe(borrowId);
    expect(borrow?.userId).toBe(userId);
    expect(borrow?.bookId).toBe(bookId);
  });
});
