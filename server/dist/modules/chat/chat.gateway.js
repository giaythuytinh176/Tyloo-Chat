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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const group_service_1 = require("./../group/group.service");
const global_1 = require("./../../common/constant/global");
const auth_service_1 = require("./../auth/auth.service");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const group_entity_1 = require("../group/entity/group.entity");
const groupMessage_entity_1 = require("../group/entity/groupMessage.entity");
const friend_entity_1 = require("../friend/entity/friend.entity");
const friendMessage_entity_1 = require("../friend/entity/friendMessage.entity");
const fs_1 = require("fs");
const path_1 = require("path");
const rcode_1 = require("../../common/constant/rcode");
const utils_1 = require("../../common/tool/utils");
const global_2 = require("../../common/constant/global");
const elasticsearch_1 = require("../../common/middleware/elasticsearch");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./../user/entity/user.entity");
const WsJwtGuard_1 = require("./../../common/guards/WsJwtGuard");
const nodejieba = require('nodejieba');
const fs = require('fs');
let ChatGateway = class ChatGateway {
    constructor(userRepository, groupRepository, groupUserRepository, groupMessageRepository, friendRepository, friendMessageRepository, authService, groupService) {
        this.userRepository = userRepository;
        this.groupRepository = groupRepository;
        this.groupUserRepository = groupUserRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.friendRepository = friendRepository;
        this.friendMessageRepository = friendMessageRepository;
        this.authService = authService;
        this.groupService = groupService;
    }
    async handleConnection(client) {
        const token = client.handshake.query.token;
        const user = this.authService.verifyUser(token);
        const { userId } = user;
        client.join(global_1.defaultGroupId);
        console.log('用户上线', userId);
        client.broadcast.emit('userOnline', {
            code: rcode_1.RCode.OK,
            msg: 'userOnline',
            data: userId,
        });
        if (userId) {
            client.join(userId);
        }
        return '连接成功';
    }
    async handleDisconnect(client) {
        const userId = client.handshake.query.userId;
        console.log('用户下线', userId);
        client.broadcast.emit('userOffline', {
            code: rcode_1.RCode.OK,
            msg: 'userOffline',
            data: userId,
        });
    }
    async addGroup(client, data) {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        if (isUser) {
            const isHaveGroup = await this.groupRepository.findOne({
                groupName: data.groupName,
            });
            if (isHaveGroup) {
                this.server.to(data.userId).emit('addGroup', {
                    code: rcode_1.RCode.FAIL,
                    msg: '该群名字已存在',
                    data: isHaveGroup,
                });
                return;
            }
            if (!utils_1.nameVerify(data.groupName)) {
                return;
            }
            data = await this.groupRepository.save(data);
            client.join(data.groupId);
            const group = await this.groupUserRepository.save(data);
            const member = isUser;
            member.online = 1;
            member.isManager = 1;
            data.members = [member];
            this.server.to(group.groupId).emit('addGroup', {
                code: rcode_1.RCode.OK,
                msg: `成功创建群${data.groupName}`,
                data: group,
            });
        }
        else {
            this.server
                .to(data.userId)
                .emit('addGroup', { code: rcode_1.RCode.FAIL, msg: `你没资格创建群` });
        }
    }
    async joinGroup(client, data) {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        if (isUser) {
            const group = await this.groupRepository.findOne({
                groupId: data.groupId,
            });
            let userGroup = await this.groupUserRepository.findOne({
                groupId: group.groupId,
                userId: data.userId,
            });
            const user = await this.userRepository.findOne({ userId: data.userId });
            if (group && user) {
                if (!userGroup) {
                    data.groupId = group.groupId;
                    userGroup = await this.groupUserRepository.save(data);
                }
                client.join(group.groupId);
                const res = { group: group, user: user };
                this.server.to(group.groupId).emit('joinGroup', {
                    code: rcode_1.RCode.OK,
                    msg: `${user.username}加入群${group.groupName}`,
                    data: res,
                });
            }
            else {
                this.server
                    .to(data.userId)
                    .emit('joinGroup', { code: rcode_1.RCode.FAIL, msg: '进群失败', data: '' });
            }
        }
        else {
            this.server
                .to(data.userId)
                .emit('joinGroup', { code: rcode_1.RCode.FAIL, msg: '你没资格进群' });
        }
    }
    async joinGroupSocket(client, data) {
        const group = await this.groupRepository.findOne({ groupId: data.groupId });
        const user = await this.userRepository.findOne({ userId: data.userId });
        if (group && user) {
            client.join(group.groupId);
            const res = { group: group, user: user };
            this.server.to(group.groupId).emit('joinGroupSocket', {
                code: rcode_1.RCode.OK,
                msg: `${user.username}加入群${group.groupName}`,
                data: res,
            });
        }
        else {
            this.server.to(data.userId).emit('joinGroupSocket', {
                code: rcode_1.RCode.FAIL,
                msg: '进群失败',
                data: '',
            });
        }
    }
    async sendGroupMessage(data) {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        console.log(data);
        if (isUser) {
            const userGroupMap = await this.groupUserRepository.findOne({
                userId: data.userId,
                groupId: data.groupId,
            });
            if (!userGroupMap || !data.groupId) {
                this.server.to(data.userId).emit('groupMessage', {
                    code: rcode_1.RCode.FAIL,
                    msg: '群消息发送错误',
                    data: '',
                });
                return;
            }
            if (data.messageType === 'file' ||
                data.messageType === 'image' ||
                data.messageType === 'video') {
                const SAVE_PATH = data.messageType === 'image' ? global_1.IMAGE_SAVE_PATH : global_1.FILE_SAVE_PATH;
                const saveName = data.messageType === 'image'
                    ? `${Date.now()}$${data.userId}$${data.width}$${data.height}`
                    : `${Date.now()}$${data.userId}$${utils_1.formatBytes(data.size)}$${data.fileName}`;
                console.log(data.content);
                const stream = fs_1.createWriteStream(path_1.join(SAVE_PATH, saveName));
                stream.write(data.content);
                data.content = saveName;
            }
            console.log(data.groupId);
            data.time = new Date().valueOf();
            await this.groupMessageRepository.save(data);
            this.server.to(data.groupId).emit('groupMessage', {
                code: rcode_1.RCode.OK,
                msg: '',
                data: Object.assign(Object.assign({}, data), { username: isUser.username }),
            });
        }
        else {
            this.server
                .to(data.userId)
                .emit('groupMessage', { code: rcode_1.RCode.FAIL, msg: '你没资格发消息' });
        }
    }
    async addFriend(client, data) {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        if (isUser) {
            if (data.friendId && data.userId) {
                if (data.userId === data.friendId) {
                    this.server.to(data.userId).emit('addFriend', {
                        code: rcode_1.RCode.FAIL,
                        msg: '不能添加自己为好友',
                        data: '',
                    });
                    return;
                }
                const relation1 = await this.friendRepository.findOne({
                    userId: data.userId,
                    friendId: data.friendId,
                });
                const relation2 = await this.friendRepository.findOne({
                    userId: data.friendId,
                    friendId: data.userId,
                });
                const roomId = data.userId > data.friendId
                    ? data.userId + data.friendId
                    : data.friendId + data.userId;
                if (relation1 || relation2) {
                    this.server.to(data.userId).emit('addFriend', {
                        code: rcode_1.RCode.FAIL,
                        msg: '已经有该好友',
                        data: data,
                    });
                    return;
                }
                let friend = (await this.userRepository.findOne({
                    userId: data.friendId,
                }));
                const user = (await this.userRepository.findOne({
                    userId: data.userId,
                }));
                if (!friend) {
                    if (data.friendUserName) {
                        const res = await this.authService.register({
                            userId: data.friendId,
                            username: data.friendUserName,
                            avatar: '',
                            role: 'user',
                            tag: '',
                            status: 'on',
                            createTime: new Date().valueOf(),
                            password: global_2.defaultPassword,
                        });
                        friend = res.data.user;
                        await this.friendRepository.save({
                            userId: friend.userId,
                            friendId: global_1.defaultRobotId,
                        });
                    }
                    else {
                        this.server.to(data.userId).emit('addFriend', {
                            code: rcode_1.RCode.FAIL,
                            msg: '该好友不存在',
                            data: '',
                        });
                        return;
                    }
                }
                await this.friendRepository.save(data);
                const friendData = JSON.parse(JSON.stringify(data));
                const friendId = friendData.friendId;
                friendData.friendId = friendData.userId;
                friendData.userId = friendId;
                delete friendData._id;
                await this.friendRepository.save(friendData);
                client.join(roomId);
                let messages = await typeorm_2.getRepository(friendMessage_entity_1.FriendMessage)
                    .createQueryBuilder('friendMessage')
                    .orderBy('friendMessage.time', 'DESC')
                    .where('friendMessage.userId = :userId AND friendMessage.friendId = :friendId', { userId: data.userId, friendId: data.friendId })
                    .orWhere('friendMessage.userId = :friendId AND friendMessage.friendId = :userId', { userId: data.userId, friendId: data.friendId })
                    .take(30)
                    .getMany();
                messages = messages.reverse();
                if (messages.length) {
                    friend.messages = messages;
                    user.messages = messages;
                }
                let onlineUserIdArr = Object.values(this.server.engine.clients).map((item) => {
                    return item.request._query.userId;
                });
                onlineUserIdArr = Array.from(new Set(onlineUserIdArr));
                friend.online = onlineUserIdArr.includes(friend.userId) ? 1 : 0;
                this.server.to(data.userId).emit('addFriend', {
                    code: rcode_1.RCode.OK,
                    msg: `添加好友${friend.username}成功`,
                    data: friend,
                });
                user.online = 1;
                this.server.to(data.friendId).emit('addFriend', {
                    code: rcode_1.RCode.OK,
                    msg: `${user.username}添加你为好友`,
                    data: user,
                });
            }
        }
        else {
            this.server
                .to(data.userId)
                .emit('addFriend', { code: rcode_1.RCode.FAIL, msg: '你没资格加好友' });
        }
    }
    async joinFriend(client, data) {
        if (data.friendId && data.userId) {
            const relation = await this.friendRepository.findOne({
                userId: data.userId,
                friendId: data.friendId,
            });
            const roomId = data.userId > data.friendId
                ? data.userId + data.friendId
                : data.friendId + data.userId;
            if (relation) {
                client.join(roomId);
                this.server.to(data.userId).emit('joinFriendSocket', {
                    code: rcode_1.RCode.OK,
                    msg: '进入私聊socket成功',
                    data: relation,
                });
            }
        }
    }
    async friendMessage(client, data) {
        const isUser = await this.userRepository.findOne({ userId: data.userId });
        if (isUser) {
            if (data.userId && data.friendId) {
                const roomId = data.userId > data.friendId
                    ? data.userId + data.friendId
                    : data.friendId + data.userId;
                if (data.messageType === 'file' ||
                    data.messageType === 'image' ||
                    data.messageType === 'video') {
                    const SAVE_PATH = data.messageType === 'image' ? global_1.IMAGE_SAVE_PATH : global_1.FILE_SAVE_PATH;
                    const saveName = data.messageType === 'image'
                        ? `${Date.now()}$${data.userId}$${data.width}$${data.height}`
                        : `${Date.now()}$${data.userId}$${utils_1.formatBytes(data.size)}$${data.fileName}`;
                    console.log(data.content);
                    const stream = fs_1.createWriteStream(path_1.join(SAVE_PATH, saveName));
                    stream.write(data.content);
                    data.content = saveName;
                    console.log(roomId);
                    console.log(data.friendId);
                }
                data.time = new Date().valueOf();
                await this.friendMessageRepository.save(data);
                this.server
                    .to(roomId)
                    .emit('friendMessage', { code: rcode_1.RCode.OK, msg: '', data });
                if (data.friendId === global_1.defaultRobotId) {
                    this.autoReply(data, roomId);
                }
            }
        }
        else {
            this.server.to(data.userId).emit('friendMessage', {
                code: rcode_1.RCode.FAIL,
                msg: '你没资格发消息',
                data,
            });
        }
    }
    async getReplyMessage(content) {
        const failMessage = '智能助手不知道你在说什么。';
        try {
            const splitWords = nodejieba.cut(content).join(' ');
            console.log(splitWords);
            const res = await elasticsearch_1.getElasticData(splitWords);
            console.log(res.data);
            const result = res.data.hits.hits;
            if (result.length > 0) {
                return result[0]._source.title;
            }
            return failMessage;
        }
        catch (e) {
            return failMessage;
        }
    }
    async autoReply(data, roomId) {
        const message = await this.getReplyMessage(data.content);
        const reply = {
            time: new Date().valueOf(),
            content: message,
            userId: global_1.defaultRobotId,
            friendId: data.userId,
            messageType: 'text',
        };
        await this.friendMessageRepository.save(reply);
        this.server
            .to(roomId)
            .emit('friendMessage', { code: rcode_1.RCode.OK, msg: '', data: reply });
    }
    async getAllData(token) {
        const user = this.authService.verifyUser(token);
        if (user) {
            const isUser = await this.userRepository.findOne({
                userId: user.userId,
            });
            let groupArr = [];
            let friendArr = [];
            const userGather = {};
            let userArr = [];
            let onlineUserIdArr = Object.values(this.server.engine.clients).map((item) => {
                return item.request._query.userId;
            });
            onlineUserIdArr = Array.from(new Set(onlineUserIdArr));
            const groups = await typeorm_2.getRepository(group_entity_1.Group)
                .createQueryBuilder('group')
                .innerJoin('group_map', 'group_map', 'group_map.groupId = group.groupId')
                .select('group.groupName', 'groupName')
                .addSelect('group.groupId', 'groupId')
                .addSelect('group.notice', 'notice')
                .addSelect('group.userId', 'userId')
                .addSelect('group_map.createTime', 'createTime')
                .where('group_map.userId = :id', { id: isUser.userId })
                .getRawMany();
            const friends = await typeorm_2.getRepository(user_entity_1.User)
                .createQueryBuilder('user')
                .select('user.userId', 'userId')
                .addSelect('user.username', 'username')
                .addSelect('user.avatar', 'avatar')
                .addSelect('user.role', 'role')
                .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('s.userId')
                    .innerJoin('user_map', 'p', 'p.friendId = s.userId')
                    .from(`user`, 's')
                    .where('p.userId = :userId', { userId: isUser.userId })
                    .getQuery();
                return 'user.userId IN ' + subQuery;
            })
                .getRawMany();
            const groupMessagePromise = groups.map(async (item) => {
                const createTime = item.createTime;
                const groupMessage = await typeorm_2.getRepository(groupMessage_entity_1.GroupMessage)
                    .createQueryBuilder('group_message')
                    .innerJoin('user', 'user', 'user.userId = group_message.userId')
                    .select('group_message.*')
                    .addSelect('user.username', 'username')
                    .orderBy('group_message.time', 'DESC')
                    .where('group_message.groupId = :id', { id: item.groupId })
                    .andWhere('group_message.time >= :createTime', {
                    createTime: createTime - global_1.defaultGroupMessageTime,
                })
                    .limit(10)
                    .getRawMany();
                groupMessage.reverse();
                for (const message of groupMessage) {
                    if (!userGather[message.userId]) {
                        userGather[message.userId] = await this.userRepository.findOne({
                            userId: message.userId,
                        });
                    }
                }
                return groupMessage;
            });
            const friendMessagePromise = friends.map(async (item) => {
                const messages = await typeorm_2.getRepository(friendMessage_entity_1.FriendMessage)
                    .createQueryBuilder('friendMessage')
                    .orderBy('friendMessage.time', 'DESC')
                    .where('friendMessage.userId = :userId AND friendMessage.friendId = :friendId', { userId: user.userId, friendId: item.userId })
                    .orWhere('friendMessage.userId = :friendId AND friendMessage.friendId = :userId', { userId: user.userId, friendId: item.userId })
                    .take(10)
                    .getMany();
                return messages.reverse();
            });
            const groupsMessage = await Promise.all(groupMessagePromise);
            await Promise.all(groups.map(async (group, index) => {
                if (groupsMessage[index] && groupsMessage[index].length) {
                    group.messages = groupsMessage[index];
                }
                group.members = [];
                const groupUserArr = await this.groupUserRepository.find({
                    groupId: group.groupId,
                });
                if (groupUserArr.length) {
                    for (const u of groupUserArr) {
                        const _user = await this.userRepository.findOne({
                            userId: u.userId,
                        });
                        if (_user) {
                            onlineUserIdArr.includes(_user.userId)
                                ? (_user.online = 1)
                                : (_user.online = 0);
                            _user.isManager = _user.userId === group.userId ? 1 : 0;
                            group.members.push(_user);
                        }
                    }
                }
                return Promise.resolve(group);
            }));
            groupArr = groups;
            const friendsMessage = await Promise.all(friendMessagePromise);
            friends.map((friend, index) => {
                if (friendsMessage[index] && friendsMessage[index].length) {
                    friend.messages = friendsMessage[index];
                }
                friend.online = onlineUserIdArr.includes(friend.userId) ? 1 : 0;
            });
            friendArr = friends;
            userArr = [...Object.values(userGather), ...friendArr];
            this.server.to(user.userId).emit('chatData', {
                code: rcode_1.RCode.OK,
                msg: '获取聊天数据成功',
                data: {
                    groupData: groupArr,
                    friendData: friendArr,
                    userData: userArr,
                },
            });
        }
    }
    async exitGroup(client, groupMap) {
        if (groupMap.groupId === global_1.defaultGroupId) {
            return this.server
                .to(groupMap.userId)
                .emit('exitGroup', { code: rcode_1.RCode.FAIL, msg: '默认群不可退' });
        }
        const user = await this.userRepository.findOne({ userId: groupMap.userId });
        const group = await this.groupRepository.findOne({
            groupId: groupMap.groupId,
        });
        const map = await this.groupUserRepository.findOne({
            userId: groupMap.userId,
            groupId: groupMap.groupId,
        });
        if (user && group && map) {
            await this.groupUserRepository.remove(map);
            return this.server
                .to(groupMap.groupId)
                .emit('exitGroup', { code: rcode_1.RCode.OK, msg: '退群成功', data: groupMap });
        }
        this.server
            .to(groupMap.userId)
            .emit('exitGroup', { code: rcode_1.RCode.FAIL, msg: '退群失败' });
    }
    async exitFriend(client, userMap) {
        const user = await this.userRepository.findOne({ userId: userMap.userId });
        const friend = await this.userRepository.findOne({
            userId: userMap.friendId,
        });
        const map1 = await this.friendRepository.findOne({
            userId: userMap.userId,
            friendId: userMap.friendId,
        });
        const map2 = await this.friendRepository.findOne({
            userId: userMap.friendId,
            friendId: userMap.userId,
        });
        if (user && friend && map1 && map2) {
            await this.friendRepository.remove(map1);
            await this.friendRepository.remove(map2);
            return this.server.to(userMap.userId).emit('exitFriend', {
                code: rcode_1.RCode.OK,
                msg: '删好友成功',
                data: userMap,
            });
        }
        this.server
            .to(userMap.userId)
            .emit('exitFriend', { code: rcode_1.RCode.FAIL, msg: '删好友失败' });
    }
    async revokeMessage(client, messageDto) {
        if (messageDto.groupId) {
            const groupMessage = await this.groupMessageRepository.findOne(messageDto._id);
            await this.groupMessageRepository.remove(groupMessage);
            return this.server.to(messageDto.groupId).emit('revokeMessage', {
                code: rcode_1.RCode.OK,
                msg: '已撤回了一条消息',
                data: messageDto,
            });
        }
        else {
            const friendMessage = await this.friendMessageRepository.findOne(messageDto._id);
            const roomId = messageDto.userId > messageDto.friendId
                ? messageDto.userId + messageDto.friendId
                : messageDto.friendId + messageDto.userId;
            console.log('消息撤回---' + messageDto._id);
            await this.friendMessageRepository.remove(friendMessage);
            return this.server.to(roomId).emit('revokeMessage', {
                code: rcode_1.RCode.OK,
                msg: '已撤回了一条消息',
                data: messageDto,
            });
        }
    }
    async updateGroupNotice(data) {
        console.log(data);
        const group = await this.groupRepository.findOne(data.groupId);
        group.groupName = data.groupName;
        group.notice = data.notice;
        const res = await this.groupService.update(group);
        this.server.to(data.groupId).emit('updateGroupInfo', res);
        return;
    }
    async updateUserInfo(client, userId) {
        const user = await this.userRepository.findOne({
            userId,
        });
        client.broadcast.emit('updateUserInfo', {
            code: rcode_1.RCode.OK,
            msg: 'userOnline',
            data: user,
        });
    }
    async inviteFriendsIntoGroup(data) {
        try {
            const isUser = await this.userRepository.findOne({ userId: data.userId });
            const group = await this.groupRepository.findOne({
                groupId: data.groupId,
            });
            const res = {
                group: group,
                friendIds: data.friendIds,
                userId: data.userId,
                invited: true,
            };
            if (isUser) {
                for (const friendId of data.friendIds) {
                    if (group) {
                        data.groupId = group.groupId;
                        await this.groupUserRepository.save({
                            groupId: data.groupId,
                            userId: friendId,
                        });
                        this.server.to(friendId).emit('joinGroup', {
                            code: rcode_1.RCode.OK,
                            msg: isUser.username + '邀请您加入群聊' + group.groupName,
                            data: res,
                        });
                    }
                }
                console.log('inviteFriendsIntoGroup', res);
                this.server.to(group.groupId).emit('joinGroup', {
                    code: rcode_1.RCode.OK,
                    msg: '邀请' + data.friendIds.length + '位好友加入群聊',
                    data: res,
                });
            }
        }
        catch (error) {
            this.server.to(data.userId).emit('joinGroup', {
                code: rcode_1.RCode.FAIL,
                msg: '邀请失败:' + error,
                data: null,
            });
        }
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('addGroup'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "addGroup", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('joinGroup'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object, group_entity_1.GroupMap]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinGroup", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('joinGroupSocket'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object, group_entity_1.GroupMap]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinGroupSocket", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('groupMessage'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendGroupMessage", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('addFriend'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "addFriend", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('joinFriendSocket'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object, friend_entity_1.UserMap]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinFriend", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('friendMessage'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "friendMessage", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('chatData'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllData", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('exitGroup'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object, group_entity_1.GroupMap]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "exitGroup", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('exitFriend'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _j : Object, friend_entity_1.UserMap]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "exitFriend", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('revokeMessage'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _k : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "revokeMessage", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('updateGroupInfo'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateGroupNotice", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('updateUserInfo'),
    __param(0, websockets_1.ConnectedSocket()),
    __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_l = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _l : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateUserInfo", null);
__decorate([
    common_1.UseGuards(WsJwtGuard_1.WsJwtGuard),
    websockets_1.SubscribeMessage('inviteFriendsIntoGroup'),
    __param(0, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "inviteFriendsIntoGroup", null);
ChatGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(1, typeorm_1.InjectRepository(group_entity_1.Group)),
    __param(2, typeorm_1.InjectRepository(group_entity_1.GroupMap)),
    __param(3, typeorm_1.InjectRepository(groupMessage_entity_1.GroupMessage)),
    __param(4, typeorm_1.InjectRepository(friend_entity_1.UserMap)),
    __param(5, typeorm_1.InjectRepository(friendMessage_entity_1.FriendMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        group_service_1.GroupService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map