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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as express from "./post.controller";
// import CreatePostDto from "./post.dto";
// import PostNotFoundException from "../exceptions/PostNotFoundException";
// import Post from "./post.entity";
const contents_admin_query_1 = __importDefault(require("./contents.admin.query"));
const typedi_1 = require("typedi");
var contentsType;
(function (contentsType) {
    contentsType["NOTICE"] = "NOTICE";
    contentsType["CONTENTS"] = "CONTENTS";
})(contentsType || (contentsType = {}));
let ContentsService = class ContentsService {
    constructor() {
        this.utils = new this.Utils();
        this.getAll = async (page) => {
            const contents = await this.mysql.exec(this.Query.all(page));
            let imgFile;
            if (contents.length !== 0) {
                let query = [];
                contents.map((val, idx) => {
                    query.push(this.Query.imgFile(val.contents_seq));
                });
                imgFile = await this.mysql.get(query);
            }
            else {
                imgFile = [];
            }
            // const contents = await this.contentsRepository.find({
            //     where: {
            //         serial_number: serialNumber,
            //         contents_type: contentsType.CONTENTS,
            //     },
            //     order: {
            //         contents_seq: 'DESC'
            //     },
            //     skip: (page - 1) * 10,
            //     take: 10,
            // });
            return { contents, imgFile };
        };
        this.getNotice = async () => {
            let notice = (await this.mysql.exec(this.Query.notice()))[0];
            let imgFile;
            if (notice) {
                let query = this.Query.imgFile(notice.contents_seq);
                imgFile = await this.mysql.exec(query);
            }
            else {
                notice = null;
                imgFile = null;
            }
            return { notice, imgFile };
        };
        this.create = async (serialNumber, phoneNumber, fileSeqs, next) => {
            let recordSet;
            let updateResult;
            try {
                recordSet = await this.mysql.exec(this.Query.create(), [serialNumber, phoneNumber]);
                console.log(recordSet);
                console.log(recordSet.affectedRows);
                console.log(recordSet.insertId);
                let fileSeqArr = this.utils.makeArray(fileSeqs, ',');
                console.log(fileSeqArr);
                updateResult = await this.mysql.exec(this.Query.updateFile(), [recordSet.insertId, fileSeqArr]);
                console.log(updateResult);
            }
            catch (e) {
                this.logger.error(e.stack());
                throw new Error(e);
            }
            return { recordSet, updateResult };
        };
        this.Query = new contents_admin_query_1.default();
    }
    ;
};
__decorate([
    typedi_1.Inject('utils'),
    __metadata("design:type", Object)
], ContentsService.prototype, "Utils", void 0);
__decorate([
    typedi_1.Inject('mysql'),
    __metadata("design:type", Object)
], ContentsService.prototype, "mysql", void 0);
__decorate([
    typedi_1.Inject('logger'),
    __metadata("design:type", Object)
], ContentsService.prototype, "logger", void 0);
ContentsService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], ContentsService);
exports.default = ContentsService;
//# sourceMappingURL=contents.admin.service.js.map