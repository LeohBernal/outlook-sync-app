import { User } from '../../../modules/users/entity';
import { CreateUserDTO } from 'src/modules/users/dto';

export abstract class DatabaseUsersService {
  public abstract create(createUser: CreateUserDTO): Promise<User>;
  public abstract get(id: string): Promise<User>;
  public abstract validateUserCredentials(
    username: string,
    password: string,
  ): Promise<User>;
}
