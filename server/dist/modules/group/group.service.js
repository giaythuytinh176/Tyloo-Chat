"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const group_entity_1 = require("./entity/group.entity");
const groupMessage_entity_1 = require("./entity/groupMessage.entity");
const rcode_1 = require("../../common/constant/rcode");
const user_entity_1 = require("../user/entity/user.entity");
const global_1 = require("../../common/constant/global");
let GroupService = class GroupService {
    constructor(groupRepository, groupUserRepository) {
        this.groupRepository = groupRepository;
        this.groupUserRepository = groupUserRepository;
    }
    async postGroups(groupIds) {
        try {
            if (groupIds) {
                const groupIdArr = groupIds.split(',');
                const groupArr = [];
                for (const groupId of groupIdArr) {
                    const data = await this.groupRepository.findOne({ groupId: groupId });
                    groupArr.push(data);
                }
                return { msg: '获取群信息成功', data: groupArr };
            }
            return { code: rcode_1.RCode.FAIL, msg: '获取群信息失败', data: null };
        }
        catch (e) {
            return { code: rcode_1.RCode.ERROR, msg: '获取群失败', data: e };
        }
    }
    async getUserGroups(userId) {
        try {
            let data;
            if (userId) {
                data = await this.groupUserRepository.find({ userId: userId });
                return { msg: '获取用户所有群成功', data };
            }
            data = await this.groupUserRepository.find();
            return { msg: '获取系统所有群成功', data };
        }
        catch (e) {
            return { code: rcode_1.RCode.ERROR, msg: '获取用户的群失败', data: e };
        }
    }
    async getGroupMessages(userId, groupId, current, pageSize) {
        const groupUser = await this.groupUserRepository.findOne({
            userId,
            groupId,
        });
        const { createTime } = groupUser;
        let groupMessage = await typeorm_1.getRepository(groupMessage_entity_1.GroupMessage)
            .createQueryBuilder('groupMessage')
            .orderBy('groupMessage.time', 'DESC')
            .where('groupMessage.groupId = :id', { id: groupId })
            .andWhere('groupMessage.time >= :createTime', {
            createTime: createTime - global_1.defaultGroupMessageTime,
        })
            .skip(current)
            .take(pageSize)
            .getMany();
        groupMessage = groupMessage.reverse();
        const userGather = {};
        let userArr = [];
        for (const message of groupMessage) {
            if (!userGather[message.userId]) {
                userGather[message.userId] = await typeorm_1.getRepository(user_entity_1.User)
                    .createQueryBuilder('user')
                    .where('user.userId = :id', { id: message.userId })
                    .getOne();
            }
        }
        userArr = Object.values(userGather);
        return { msg: '', data: { messageArr: groupMessage, userArr: userArr } };
    }
    async getGroupsByName(groupName) {
        try {
            if (groupName) {
                const groups = await this.groupRepository.find({
                    groupName: typeorm_1.Like(`%${groupName}%`),
                });
                return { data: groups };
            }
            return { code: rcode_1.RCode.FAIL, msg: '请输入群昵称', data: null };
        }
        catch (e) {
            return { code: rcode_1.RCode.ERROR, msg: '查找群错误', data: null };
        }
    }
    async update(group) {
        try {
            await this.groupRepository.update(group.groupId, group);
            return {
                code: rcode_1.RCode.OK,
                msg: '修改成功',
                data: group,
            };
        }
        catch (e) {
            return { code: rcode_1.RCode.ERROR, msg: '更新失败', data: null };
        }
    }
};
GroupService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(group_entity_1.Group)),
    __param(1, typeorm_2.InjectRepository(group_entity_1.GroupMap)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], GroupService);
exports.GroupService = GroupService;
//# sourceMappingURL=group.service.js.map