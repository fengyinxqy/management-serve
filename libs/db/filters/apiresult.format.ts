import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiresultService {
  MESSAGE(code: number, message: string, data?: any) {
    return {
      code,
      message,
      data,
    };
  }
}
