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
const typeorm_1 = require("typeorm");
// import Address from '../address/address.entity';
// import Post from '../post/post.entity';
let LogErr = class LogErr {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], LogErr.prototype, "err_seq", void 0);
__decorate([
    typeorm_1.Column(`varchar`, { length: 10 }),
    __metadata("design:type", String)
], LogErr.prototype, "status_code", void 0);
__decorate([
    typeorm_1.Column(`varchar`, { length: 10 }),
    __metadata("design:type", String)
], LogErr.prototype, "server", void 0);
__decorate([
    typeorm_1.Column(`varchar`, { length: 100 }),
    __metadata("design:type", String)
], LogErr.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(`varchar`, { length: 100 }),
    __metadata("design:type", String)
], LogErr.prototype, "method", void 0);
__decorate([
    typeorm_1.Column(`varchar`, { length: 100 }),
    __metadata("design:type", String)
], LogErr.prototype, "path", void 0);
__decorate([
    typeorm_1.Column(`text`),
    __metadata("design:type", String)
], LogErr.prototype, "header", void 0);
__decorate([
    typeorm_1.Column(`text`),
    __metadata("design:type", String)
], LogErr.prototype, "params", void 0);
__decorate([
    typeorm_1.Column(`text`),
    __metadata("design:type", String)
], LogErr.prototype, "query", void 0);
__decorate([
    typeorm_1.Column(`text`),
    __metadata("design:type", String)
], LogErr.prototype, "payload", void 0);
__decorate([
    typeorm_1.Column(`text`),
    __metadata("design:type", String)
], LogErr.prototype, "response", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], LogErr.prototype, "reg_date", void 0);
LogErr = __decorate([
    typeorm_1.Entity('t_nf_log_error')
], LogErr);
exports.default = LogErr;
//# sourceMappingURL=log_error.entity.js.map