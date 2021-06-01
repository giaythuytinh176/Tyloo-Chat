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
exports.GroupMessage = void 0;
const typeorm_1 = require("typeorm");
let GroupMessage = class GroupMessage {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], GroupMessage.prototype, "_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GroupMessage.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GroupMessage.prototype, "groupId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GroupMessage.prototype, "content", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GroupMessage.prototype, "messageType", void 0);
__decorate([
    typeorm_1.Column('double'),
    __metadata("design:type", Number)
], GroupMessage.prototype, "time", void 0);
GroupMessage = __decorate([
    typeorm_1.Entity()
], GroupMessage);
exports.GroupMessage = GroupMessage;
//# sourceMappingURL=groupMessage.entity.js.map