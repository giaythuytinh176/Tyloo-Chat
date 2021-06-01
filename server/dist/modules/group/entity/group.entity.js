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
exports.GroupMap = exports.Group = void 0;
const typeorm_1 = require("typeorm");
let Group = class Group {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Group.prototype, "groupId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Group.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Group.prototype, "groupName", void 0);
__decorate([
    typeorm_1.Column({
        default: 'The group owner is very lazy and did not write an announcement'
    }),
    __metadata("design:type", String)
], Group.prototype, "notice", void 0);
__decorate([
    typeorm_1.Column({ type: 'double', default: new Date().valueOf() }),
    __metadata("design:type", Number)
], Group.prototype, "createTime", void 0);
Group = __decorate([
    typeorm_1.Entity()
], Group);
exports.Group = Group;
let GroupMap = class GroupMap {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], GroupMap.prototype, "_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GroupMap.prototype, "groupId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GroupMap.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'double',
        default: new Date().valueOf(),
        comment: '进群时间',
    }),
    __metadata("design:type", Number)
], GroupMap.prototype, "createTime", void 0);
GroupMap = __decorate([
    typeorm_1.Entity()
], GroupMap);
exports.GroupMap = GroupMap;
//# sourceMappingURL=group.entity.js.map