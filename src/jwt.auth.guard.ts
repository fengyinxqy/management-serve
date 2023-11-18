import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './utils/public';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request: Request = context.switchToHttp().getRequest(); // 获取请求头

    const token = this.extractTokenFromHeader(request); // 获取请求中的token字段
    if (this.hasUrl(this.urlList, request.url)) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('登录 token 错误，请重新登录');
    }
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException('身份过期，请重新登录');
    }

    return true;
  }

  private urlList: string[] = ['/user/login', '/user/register']; // 验证该次请求是否为白名单内的路由

  private hasUrl(urlList: string[], url: string): boolean {
    const flag = urlList.indexOf(url) >= 0;
    return flag;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
