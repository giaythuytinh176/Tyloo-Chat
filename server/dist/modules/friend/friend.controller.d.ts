import { FriendService } from './friend.service';
export declare class FriendController {
    private readonly friendService;
    constructor(friendService: FriendService);
    getFriends(userId: string): Promise<{
        msg: string;
        data: import("./entity/friend.entity").UserMap[];
        code?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    getFriendMessage(query: any): Promise<{
        msg: string;
        data: {
            messageArr: import("./entity/friendMessage.entity").FriendMessage[];
        };
    }>;
}
