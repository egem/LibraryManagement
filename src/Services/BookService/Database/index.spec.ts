import { InvalidRequest } from 'Exceptions/InvalidRequest.exception';
import { BookService } from 'Services/BookService/Database';
import { Book } from 'Services/DatabaseService/Tables/Book.model';

describe('BookService', () => {
  let bookService: BookService;

  beforeEach(() => {
    bookService = new BookService();
  });

  it('should create a new book', async () => {
    // Arrange
    const createSpy = spyOn(Book, 'create').and.returnValue(Promise.resolve({
      name: 'New Book'
    }));

    const newBook = { name: 'New Book' };

    // Act
    const createdBook = await bookService.createBook(newBook);

    // Assert
    expect(createdBook).toBeDefined();
    expect(createdBook?.name).toBe('New Book');
    expect(createSpy).toHaveBeenCalledWith({
      name: 'New Book'
    });
  });

  it('should retrieve a book by ID', async () => {
    const bookId: number = 1;

    // Arrange
    const findByPkSpy = spyOn(Book, 'findByPk').and.returnValue(
      Promise.resolve(
        {
          id: bookId,
          name: 'Existing Book'
        } as Book
      )
    );

    // Act
    const book = await bookService.retrieveBookById(bookId);

    // Assert
    expect(book).toBeDefined();
    expect(book?.id).toBe(bookId);
    expect(book?.name).toBe('Existing Book');
    expect(findByPkSpy).toHaveBeenCalledWith(bookId);
  });

  it('should retrieve books based on query', async () => {
    const query = {};

    // Arrange
    const findAllSpy = spyOn(Book, 'findAll').and.returnValue(
      Promise.resolve(
        [
          { name: 'Book 1' } as Book,
          { name: 'Book 2' } as Book
        ]
      )
    );

    // Act
    const books = await bookService.retriveBooks(query);

    // Assert
    expect(books).toBeDefined();
    expect(books.length).toBe(2);
    expect(books[0].name).toBe('Book 1');
    expect(books[1].name).toBe('Book 2');
    expect(findAllSpy).toHaveBeenCalledWith(query);
  });

  it('should handle errors when creating a book', async () => {
    // Arrange
    const createSpy = spyOn(Book, 'create').and.returnValue(
      Promise.reject(new Error('Database error'))
    );

    const newBook = { name: 'New Book' };

    // Act
    await expectAsync(bookService.createBook(newBook)).toBeRejectedWithError('Database error');
    expect(createSpy).toHaveBeenCalledWith(
      {
        name: 'New Book'
      }
    );
  });

  it('should throw error when creating a book with empty name', async () => {
    // Arrange
    const createSpy = spyOn(Book, 'create').and.returnValue(
      Promise.reject(new Error('Database error'))
    );

    const newBook = { name: '' };

    // Act
    await expectAsync(bookService.createBook(newBook)).toBeRejectedWithError(InvalidRequest);
    expect(createSpy).not.toHaveBeenCalledWith(
      {
        name: 'New Book'
      }
    );
  });

  it('should handle errors when retrieving a book by ID', async () => {
    const bookId = 1;

    // Arrange
    const findByPkSpy = spyOn(Book, 'findByPk').and.returnValue(
      Promise.reject(new Error('Book not found'))
    );

    // Act: Call the service method and expect it to throw an error
    await expectAsync(bookService.retrieveBookById(bookId)).toBeRejectedWithError('Book not found');
    expect(findByPkSpy).toHaveBeenCalledWith(bookId);
  });
});
