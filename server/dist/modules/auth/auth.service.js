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
exports.AuthService = void 0;
const global_1 = require("../../common/constant/global");
const friendMessage_entity_1 = require("./../friend/entity/friendMessage.entity");
const friend_entity_1 = require("./../friend/entity/friend.entity");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const group_entity_1 = require("../group/entity/group.entity");
const utils_1 = require("../../common/tool/utils");
const rcode_1 = require("../../common/constant/rcode");
const jwt = require("jsonwebtoken");
const constants_1 = require("./constants");
let AuthService = class AuthService {
    constructor(userRepository, groupUserRepository, userMapRepository, friendMessageRepository, jwtService) {
        this.userRepository = userRepository;
        this.groupUserRepository = groupUserRepository;
        this.userMapRepository = userMapRepository;
        this.friendMessageRepository = friendMessageRepository;
        this.jwtService = jwtService;
    }
    async login(data) {
        let user;
        if (data.userId && !data.password) {
            user = await this.userRepository.findOne({ userId: data.userId });
            if (!user) {
                const res = this.register(Object.assign(Object.assign({}, data), { password: global_1.defaultPassword }));
                return res;
            }
        }
        else {
            user = await this.userRepository.findOne({
                username: data.username,
                password: utils_1.md5(data.password),
            });
        }
        if (!user) {
            return {
                code: 1,
                msg: 'The username or password is incorrect',
                data: '',
            };
        }
        const payload = { userId: user.userId };
        return {
            msg: 'Login successfully',
            data: {
                user: user,
                token: this.jwtService.sign(payload),
            },
        };
    }
    async register(user) {
        const isHave = await this.userRepository.find({ username: user.username });
        if (isHave.length) {
            return { code: rcode_1.RCode.FAIL, msg: 'Duplicate username', data: '' };
        }
        user.avatar = `/avatar/avatar${Math.round(Math.random() * 19 + 1)}.png`;
        user.role = 'user';
        user.userId = user.userId;
        user.password = utils_1.md5(user.password);
        const newUser = await this.userRepository.save(user);
        const payload = { userId: newUser.userId };
        await this.groupUserRepository.save({
            userId: newUser.userId,
            groupId: global_1.defaultGroupId,
        });
        await this.userMapRepository.save({
            userId: newUser.userId,
            friendId: global_1.defaultRobotId,
        });
        await this.friendMessageRepository.save({
            userId: global_1.defaultRobotId,
            friendId: newUser.userId,
            content: global_1.defaultWelcomeMessage,
            messageType: 'text',
            time: new Date().valueOf(),
        });
        return {
            msg: 'Registered successfully',
            data: {
                user: newUser,
                token: this.jwtService.sign(payload),
            },
        };
    }
    verifyUser(token) {
        if (!token)
            return null;
        const user = jwt.verify(token, constants_1.jwtConstants.secret);
        return user;
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_entity_1.User)),
    __param(1, typeorm_1.InjectRepository(group_entity_1.GroupMap)),
    __param(2, typeorm_1.InjectRepository(friend_entity_1.UserMap)),
    __param(3, typeorm_1.InjectRepository(friendMessage_entity_1.FriendMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map