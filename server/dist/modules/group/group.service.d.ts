import { Repository } from 'typeorm';
import { Group, GroupMap } from './entity/group.entity';
import { GroupMessage } from './entity/groupMessage.entity';
import { RCode } from 'src/common/constant/rcode';
export declare class GroupService {
    private readonly groupRepository;
    private readonly groupUserRepository;
    constructor(groupRepository: Repository<Group>, groupUserRepository: Repository<GroupMap>);
    postGroups(groupIds: string): Promise<{
        msg: string;
        data: any[];
        code?: undefined;
    } | {
        code: RCode;
        msg: string;
        data: any;
    }>;
    getUserGroups(userId: string): Promise<{
        msg: string;
        data: any;
        code?: undefined;
    } | {
        code: RCode;
        msg: string;
        data: any;
    }>;
    getGroupMessages(userId: string, groupId: string, current: number, pageSize: number): Promise<{
        msg: string;
        data: {
            messageArr: GroupMessage[];
            userArr: FriendDto[];
        };
    }>;
    getGroupsByName(groupName: string): Promise<{
        data: Group[];
        code?: undefined;
        msg?: undefined;
    } | {
        code: RCode;
        msg: string;
        data: any;
    }>;
    update(group: GroupDto): Promise<{
        code: RCode;
        msg: string;
        data: GroupDto;
    }>;
}
