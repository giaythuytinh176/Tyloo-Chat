import { Repository } from 'typeorm';
import { UserMap } from './entity/friend.entity';
import { FriendMessage } from './entity/friendMessage.entity';
import { RCode } from 'src/common/constant/rcode';
export declare class FriendService {
    private readonly friendRepository;
    private readonly friendMessageRepository;
    constructor(friendRepository: Repository<UserMap>, friendMessageRepository: Repository<FriendMessage>);
    getFriends(userId: string): Promise<{
        msg: string;
        data: UserMap[];
        code?: undefined;
    } | {
        code: RCode;
        msg: string;
        data: any;
    }>;
    getFriendMessages(userId: string, friendId: string, current: number, pageSize: number): Promise<{
        msg: string;
        data: {
            messageArr: FriendMessage[];
        };
    }>;
}
