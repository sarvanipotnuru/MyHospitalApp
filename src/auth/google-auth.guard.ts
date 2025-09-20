import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const role = req.query.role; // doctor or patient

    return {
      scope: ['email', 'profile'],
      state: JSON.stringify({ role }), // 👈 pass role inside state
    };
  }
}
