import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class SocketJwtAuthGuard extends AuthGuard('socket-jwt') {
  constructor(@Inject(AuthService) private authService: AuthService) {
    super();
  }

  getRequest(context) {
    return context.switchToWs().getClient().handshake;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context.switchToWs().getClient().handshake?.query?.token;

    if (typeof token === 'undefined') {
      throw new WsException('Missing token');
    }

    // context.switchToWs().getData().user = { name: 'HungPV' };
    // return true;

    const user = await this.authService.verifyToken(token);

    if (user) {
      context.switchToWs().getData().user = user;
    }
    if (context.switchToWs().getData()) {
      return true;
    }

    throw new WsException('Token invalid');
  }
}
