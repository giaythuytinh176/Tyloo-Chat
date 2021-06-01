import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
export declare class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): import('rxjs').Observable<any> | Promise<import('rxjs').Observable<any>>;
}
