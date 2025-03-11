import { Book } from 'Services/DatabaseService/Tables/Book.model';

export interface Response extends Pick<Book, 'id'> {}
