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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const auth_service_1 = require("./../auth/auth.service");
const platform_express_1 = require("@nestjs/platform-express");
const passport_1 = require("@nestjs/passport");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    getUsers(userId) {
        return this.userService.getUser(userId);
    }
    postUsers(userIds) {
        return this.userService.postUsers(userIds);
    }
    updateUserName(req, username) {
        const oldUser = this.authService.verifyUser(req.headers.token);
        return this.userService.updateUserName(oldUser, username);
    }
    updatePassword(req, password) {
        const user = this.authService.verifyUser(req.headers.token);
        return this.userService.updatePassword(user, password);
    }
    delUser(req, { did }) {
        const user = this.authService.verifyUser(req.headers.token);
        return this.userService.delUser(user, did);
    }
    getUsersByName(username) {
        return this.userService.getUsersByName(username);
    }
    setUserAvatar(req, file) {
        const user = this.authService.verifyUser(req.headers.token);
        return this.userService.setUserAvatar(user, file);
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUsers", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body('userIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "postUsers", null);
__decorate([
    common_1.Patch('username'),
    __param(0, common_1.Req()), __param(1, common_1.Query('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateUserName", null);
__decorate([
    common_1.Patch('password'),
    __param(0, common_1.Req()), __param(1, common_1.Query('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updatePassword", null);
__decorate([
    common_1.Delete(),
    __param(0, common_1.Req()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "delUser", null);
__decorate([
    common_1.Get('/findByName'),
    __param(0, common_1.Query('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUsersByName", null);
__decorate([
    common_1.Post('/avatar'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('avatar')),
    __param(0, common_1.Req()), __param(1, common_1.UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "setUserAvatar", null);
UserController = __decorate([
    common_1.Controller('user'),
    common_1.UseGuards(passport_1.AuthGuard('jwt')),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map