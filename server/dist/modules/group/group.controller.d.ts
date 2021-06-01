import { GroupService } from './group.service';
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
    postGroups(groupIds: string): Promise<{
        msg: string;
        data: any[];
        code?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    getUserGroups(userId: string): Promise<{
        msg: string;
        data: any;
        code?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    getGroupsByName(groupName: string): Promise<{
        data: import("./entity/group.entity").Group[];
        code?: undefined;
        msg?: undefined;
    } | {
        code: import("../../common/constant/rcode").RCode;
        msg: string;
        data: any;
    }>;
    getGroupMessages(userId: string, groupId: string, current: number, pageSize: number): Promise<{
        msg: string;
        data: {
            messageArr: import("./entity/groupMessage.entity").GroupMessage[];
            userArr: FriendDto[];
        };
    }>;
}
