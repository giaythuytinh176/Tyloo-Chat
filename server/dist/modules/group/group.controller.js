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
exports.GroupController = void 0;
const common_1 = require("@nestjs/common");
const group_service_1 = require("./group.service");
const passport_1 = require("@nestjs/passport");
let GroupController = class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }
    postGroups(groupIds) {
        return this.groupService.postGroups(groupIds);
    }
    getUserGroups(userId) {
        return this.groupService.getUserGroups(userId);
    }
    getGroupsByName(groupName) {
        return this.groupService.getGroupsByName(groupName);
    }
    getGroupMessages(userId, groupId, current, pageSize) {
        return this.groupService.getGroupMessages(userId, groupId, current, pageSize);
    }
};
__decorate([
    common_1.Post(),
    __param(0, common_1.Body('groupIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "postGroups", null);
__decorate([
    common_1.Get('/userGroup'),
    __param(0, common_1.Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "getUserGroups", null);
__decorate([
    common_1.Get('/findByName'),
    __param(0, common_1.Query('groupName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "getGroupsByName", null);
__decorate([
    common_1.Get('/groupMessages'),
    __param(0, common_1.Query('userId')),
    __param(1, common_1.Query('groupId')),
    __param(2, common_1.Query('current')),
    __param(3, common_1.Query('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], GroupController.prototype, "getGroupMessages", null);
GroupController = __decorate([
    common_1.Controller('group'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
exports.GroupController = GroupController;
//# sourceMappingURL=group.controller.js.map