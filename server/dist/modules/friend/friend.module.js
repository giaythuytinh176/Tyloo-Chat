"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendModule = void 0;
const common_1 = require("@nestjs/common");
const friend_controller_1 = require("./friend.controller");
const friend_service_1 = require("./friend.service");
const typeorm_1 = require("@nestjs/typeorm");
const friend_entity_1 = require("./entity/friend.entity");
const friendMessage_entity_1 = require("./entity/friendMessage.entity");
let FriendModule = class FriendModule {
};
FriendModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([friend_entity_1.UserMap, friendMessage_entity_1.FriendMessage])],
        controllers: [friend_controller_1.FriendController],
        providers: [friend_service_1.FriendService],
    })
], FriendModule);
exports.FriendModule = FriendModule;
//# sourceMappingURL=friend.module.js.map