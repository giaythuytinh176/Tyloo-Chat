import { FriendMessage } from './../friend/entity/friendMessage.entity';
import { UserMap } from './../friend/entity/friend.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { GroupMap } from '../group/entity/group.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly groupUserRepository;
    private readonly userMapRepository;
    private readonly friendMessageRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, groupUserRepository: Repository<GroupMap>, userMapRepository: Repository<UserMap>, friendMessageRepository: Repository<FriendMessage>, jwtService: JwtService);
    login(data: User): Promise<any>;
    register(user: User): Promise<any>;
    verifyUser(token: any): User;
}
