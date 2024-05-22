import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entity';
import { client, indexes } from '../database.config';
import { DatabaseUsersService } from './database.users.service';
import { CreateUserDTO } from 'src/modules/users/dto';

@Injectable()
export class DatabaseUsersServiceImpl implements DatabaseUsersService {
  private readonly USER_INDEX = indexes.users;

  public async create(createUser: CreateUserDTO): Promise<User> {
    const id = createUser.username;
    await client.index({
      index: this.USER_INDEX,
      body: createUser,
      id,
    });
    return {
      ...createUser,
      id,
    };
  }

  public async get(username: string): Promise<User> {
    try {
      const response = await client.get<Omit<User, 'id'>>({
        index: this.USER_INDEX,
        id: username,
      });
      return {
        ...response._source,
        id: response._id,
      };
    } catch (error) {
      return null;
    }
  }

  public async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.get(username);
    if (!user || user.password !== password) {
      return null;
    }
    return user;
  }
}
