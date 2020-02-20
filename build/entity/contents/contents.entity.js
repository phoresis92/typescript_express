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
// import Category from '../category/category.entity';
// import User from '../user/user.entity';
var contentsType;
(function (contentsType) {
    contentsType["NOTICE"] = "NOTICE";
    contentsType["CONTENTS"] = "CONTENTS";
})(contentsType || (contentsType = {}));
let Contents = class Contents {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "bigint" }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Contents.prototype, "contents_seq", void 0);
__decorate([
    typeorm_1.Column(`varchar`, { length: 200 }),
    __metadata("design:type", String)
], Contents.prototype, "serial_number", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: contentsType,
        default: contentsType.CONTENTS
    }),
    __metadata("design:type", Object)
], Contents.prototype, "contents_type", void 0);
__decorate([
    typeorm_1.Column(`varchar`, { length: 1000 }),
    __metadata("design:type", String)
], Contents.prototype, "contents", void 0);
__decorate([
    typeorm_1.Column(`varchar`, { length: 50 }),
    __metadata("design:type", String)
], Contents.prototype, "phone_number", void 0);
__decorate([
    typeorm_1.Column('datetime'),
    __metadata("design:type", Date)
], Contents.prototype, "reg_date", void 0);
Contents = __decorate([
    typeorm_1.Entity('t_nf_contents')
], Contents);
exports.default = Contents;
//# sourceMappingURL=contents.entity.js.map