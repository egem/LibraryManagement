import { User } from 'Services/DatabaseService/Tables/User.model';

export interface Request extends Pick<User, 'name'> {}
