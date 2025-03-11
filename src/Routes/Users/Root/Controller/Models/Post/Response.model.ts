import { User } from 'Services/DatabaseService/Tables/User.model';

export interface Response extends Pick<User, 'id'> {}
