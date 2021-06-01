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
exports.FriendService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const friend_entity_1 = require("./entity/friend.entity");
const friendMessage_entity_1 = require("./entity/friendMessage.entity");
const rcode_1 = require("../../common/constant/rcode");
let FriendService = class FriendService {
    constructor(friendRepository, friendMessageRepository) {
        this.friendRepository = friendRepository;
        this.friendMessageRepository = friendMessageRepository;
    }
    async getFriends(userId) {
        try {
            if (userId) {
                return {
                    msg: '获取用户好友成功',
                    data: await this.friendRepository.find({ userId: userId }),
                };
            }
            else {
                return {
                    msg: '获取用户好友失败',
                    data: await this.friendRepository.find(),
                };
            }
        }
        catch (e) {
            return { code: rcode_1.RCode.ERROR, msg: '获取用户好友失败', data: e };
        }
    }
    async getFriendMessages(userId, friendId, current, pageSize) {
        const messages = await typeorm_1.getRepository(friendMessage_entity_1.FriendMessage)
            .createQueryBuilder('friendMessage')
            .orderBy('friendMessage.time', 'DESC')
            .where('friendMessage.userId = :userId AND friendMessage.friendId = :friendId', { userId: userId, friendId: friendId })
            .orWhere('friendMessage.userId = :friendId AND friendMessage.friendId = :userId', { userId: userId, friendId: friendId })
            .skip(current)
            .take(pageSize)
            .getMany();
        return { msg: '', data: { messageArr: messages.reverse() } };
    }
};
FriendService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(friend_entity_1.UserMap)),
    __param(1, typeorm_2.InjectRepository(friendMessage_entity_1.FriendMessage)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], FriendService);
exports.FriendService = FriendService;
//# sourceMappingURL=friend.service.js.map