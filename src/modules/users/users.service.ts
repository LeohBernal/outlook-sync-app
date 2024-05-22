import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto';
import { User, UserWithoutPassword } from './entity';
import { DatabaseService } from 'src/common/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  public async create(createUser: CreateUserDTO): Promise<UserWithoutPassword> {
    const userExists = await this.database.users.get(createUser.username);
    if (userExists) {
      throw new Error('Username already exists');
    }
    const user = await this.database.users.create(createUser);
    return this.extractUserWithoutPassword(user);
  }

  public async login(
    username: string,
    password: string,
  ): Promise<UserWithoutPassword> {
    const user = await this.database.users.validateUserCredentials(
      username,
      password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.extractUserWithoutPassword(user);
  }

  public async getUser(id: string): Promise<UserWithoutPassword> {
    const user = await this.database.users.get(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.extractUserWithoutPassword(user);
  }

  private extractUserWithoutPassword(user: User): UserWithoutPassword {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
