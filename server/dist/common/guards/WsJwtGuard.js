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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsJwtGuard = void 0;
const auth_service_1 = require("./../../modules/auth/auth.service");
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let WsJwtGuard = class WsJwtGuard {
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        var _a, _b;
        let client;
        try {
            client = context.switchToWs().getClient();
            const authToken = (_b = (_a = client.handshake) === null || _a === void 0 ? void 0 : _a.query) === null || _b === void 0 ? void 0 : _b.token;
            const user = this.authService.verifyUser(authToken);
            return Boolean(user);
        }
        catch (err) {
            client.emit('unauthorized', '用户信息校验失败,请重新登录!');
            client.disconnect();
            throw new websockets_1.WsException(err.message);
        }
    }
};
WsJwtGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], WsJwtGuard);
exports.WsJwtGuard = WsJwtGuard;
//# sourceMappingURL=WsJwtGuard.js.map