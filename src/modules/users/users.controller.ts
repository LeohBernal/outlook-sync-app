import { Body, Controller, Post, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto';
import { UserWithoutPassword } from './entity';
import { SessionData } from 'express-session';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  public async create(
    @Body() createUser: CreateUserDTO,
    @Session() session: SessionData,
  ): Promise<UserWithoutPassword> {
    const user = await this.userService.create(createUser);
    session.user = user;
    return user;
  }

  @Post('logout')
  public async logout(@Session() session: SessionData): Promise<void> {
    session.user = null;
  }
}
