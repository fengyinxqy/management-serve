import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from 'libs/db/Entities/base.entity';

@Entity('user')
export class User extends Base {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '用户名',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '密码',
    select: false,
  })
  password: string;

  @Column({
    nullable: true,
    comment: '角色',
  })
  role: string;

  @Column({
    nullable: true,
    comment: '昵称',
  })
  nickname: string;

  @Column({
    nullable: true,
    comment: '年龄',
  })
  age: number;

  @Column({
    nullable: true,
    comment: '头像',
  })
  avatar: string;

  @Column({
    nullable: true,
    comment: '性别',
  })
  sex: string;

  @Column({
    nullable: true,
    comment: '邮箱',
  })
  email: string;
}
