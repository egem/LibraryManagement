import { Book } from 'Services/DatabaseService/Tables/Book.model';

export interface Request extends Pick<Book, 'name'> {}
