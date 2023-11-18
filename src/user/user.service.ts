import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { md5 } from 'src/utils/md5';
import { ApiresultService } from 'libs/db/filters/apiresult.format';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  Apiresult = new ApiresultService();

  async register(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const existUser = await this.userRepository.findOneBy({
      username,
    });
    if (existUser) {
      throw new HttpException('用户名已存在', 200);
    }
    // 对密码进行加密
    const newUser = new User();
    newUser.username = username;
    newUser.password = md5(password);
    try {
      await this.userRepository.save(newUser);
      return await this.userRepository.findOne({ where: { username } });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const existUser = await this.userRepository.findOne({
      where: { username },
      select: ['username', 'password'],
    });

    if (!existUser) {
      throw new HttpException('用户不存在', 200);
    }
    if (existUser.password !== md5(password)) {
      throw new HttpException('密码错误,请重新登录', 200);
    }

    return existUser;
  }

  async create(createUserDto: CreateUserDto) {
    return await this.userRepository.save(createUserDto);
  }

  async findAll() {
    try {
      const data = await this.userRepository.find();
      return {
        ...this.Apiresult.MESSAGE(200, '查询成功', data),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
