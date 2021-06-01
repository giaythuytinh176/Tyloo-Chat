import { AuthService } from './../../modules/auth/auth.service';
import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class WsJwtGuard implements CanActivate {
    private authService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
