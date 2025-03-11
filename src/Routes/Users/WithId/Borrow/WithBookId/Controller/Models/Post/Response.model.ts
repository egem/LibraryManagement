import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';

export interface Response extends Pick<Borrow, 'id'> {}
