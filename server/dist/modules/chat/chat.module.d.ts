import { User } from '../user/entity/user.entity';
import { Group, GroupMap } from '../group/entity/group.entity';
import { Repository } from 'typeorm';
export declare class ChatModule {
    private readonly groupRepository;
    private readonly userRepository;
    private readonly groupUserRepository;
    constructor(groupRepository: Repository<Group>, userRepository: Repository<User>, groupUserRepository: Repository<GroupMap>);
    onModuleInit(): Promise<void>;
}
