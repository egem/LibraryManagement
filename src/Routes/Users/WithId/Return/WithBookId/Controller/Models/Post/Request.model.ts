import { Borrow } from 'Services/DatabaseService/Tables/Borrow.model';

export interface Request extends Pick<Borrow, 'score'> {}
