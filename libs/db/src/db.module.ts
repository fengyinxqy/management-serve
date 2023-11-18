import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`, '.env.stage.default'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get('DB_PORT'), // 端口号
        username: ConfigService.get('DB_USERNAME'), // 用户名
        password: ConfigService.get('DB_PASSWORD'), // 密码
        database: ConfigService.get('DB_DATABASE'), //数据库名
        autoLoadEntities: true, //自动加载实体配置，forFeature()注册的每个实体都自己动加载
        synchronize: ConfigService.get('DB_SYNC'), // 是否将实体同步到数据库
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRESIN'),
        },
      }),
    }),
  ],
})
export class DbModule { }
