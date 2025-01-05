import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.model';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: UserCreateDto): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: { username: username },
    });
  }

  async update(id: string, updateUserDto: UserUpdateDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
