import { UserService } from './user.service';
import { AuthService } from './../auth/auth.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    getUsers(userId: string): Promise<{
        msg: string;
        data: any;
        code?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    postUsers(userIds: string): Promise<{
        msg: string;
        data: any[];
        code?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    updateUserName(req: any, username: any): Promise<{
        code: number;
        msg: string;
        data: string;
    } | {
        msg: string;
        data: import("./entity/user.entity").User;
        code?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    updatePassword(req: any, password: any): Promise<{
        msg: string;
        data: any;
        code?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    delUser(req: any, { did }: {
        did: any;
    }): Promise<{
        msg: string;
        code?: undefined;
        data?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    getUsersByName(username: string): Promise<{
        data: import("./entity/user.entity").User[];
        code?: undefined;
        msg?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    setUserAvatar(req: any, file: any): Promise<{
        msg: string;
        data: import("./entity/user.entity").User;
        code?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data?: undefined;
    }>;
}
