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
var fileType;
(function (fileType) {
    fileType["IMG"] = "IMG";
    fileType["MOV"] = "MOV";
})(fileType || (fileType = {}));
let Post = class Post {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: 'bigint',
    }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Post.prototype, "file_seq", void 0);
__decorate([
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Post.prototype, "target_type", void 0);
__decorate([
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Post.prototype, "target_key", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: fileType,
    }),
    __metadata("design:type", Object)
], Post.prototype, "file_type", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bigint',
        length: 20
    }),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], Post.prototype, "file_size", void 0);
__decorate([
    typeorm_1.Column({ length: 100 }),
    __metadata("design:type", String)
], Post.prototype, "file_path", void 0);
__decorate([
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Post.prototype, "file_name", void 0);
__decorate([
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Post.prototype, "file_extension", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', length: 11 }),
    __metadata("design:type", Number)
], Post.prototype, "file_width", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', length: 11 }),
    __metadata("design:type", Number)
], Post.prototype, "file_height", void 0);
__decorate([
    typeorm_1.Column({ length: 100 }),
    __metadata("design:type", String)
], Post.prototype, "thumb_path", void 0);
__decorate([
    typeorm_1.Column({ length: 50 }),
    __metadata("design:type", String)
], Post.prototype, "thumb_name", void 0);
__decorate([
    typeorm_1.Column({ length: 20 }),
    __metadata("design:type", String)
], Post.prototype, "thumb_extension", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', length: 11 }),
    __metadata("design:type", Number)
], Post.prototype, "thumb_width", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', length: 11 }),
    __metadata("design:type", Number)
], Post.prototype, "thumb_heigth", void 0);
Post = __decorate([
    typeorm_1.Entity('t_nf_file')
], Post);
exports.default = Post;
//# sourceMappingURL=post.entity.js.map