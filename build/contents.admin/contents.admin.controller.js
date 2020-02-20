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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const HttpException_1 = __importDefault(require("../exceptions/HttpException"));
// import RequestWithUser from '../interfaces/requestWithUser.interface';
// import authMiddleware from '../middleware/auth.middleware';
// import validationMiddleware from '../middleware/validation.middleware';
// import CreatePostDto from './post.dto';
// import Post from './post.entity';
const SuccessResponse_1 = __importDefault(require("../utils/SuccessResponse"));
const celebrate_1 = require("celebrate");
const typedi_1 = require("typedi");
const contents_admin_service_1 = __importDefault(require("./contents.admin.service"));
class ContentsController {
    constructor() {
        this.path = '/why';
        this.router = express.Router();
        this.createContents = async (request, response, next) => {
            const serialNumber = request.body.serialNumber;
            const phoneNumber = request.body.phoneNumber;
            const fileSeqs = request.body.fileSeqs;
            try {
                const contentsService = typedi_1.Container.get(contents_admin_service_1.default);
                const { recordSet, updateResult } = await contentsService.create(serialNumber, phoneNumber, fileSeqs, next);
                response.send(new SuccessResponse_1.default(request, request.params, next).make({}, 1));
            }
            catch (e) {
                this.logger.error(e.stack());
                next(new HttpException_1.default(500, e.message, request.params));
            }
        };
        this.getContents = async (request, response, next) => {
            const page = request.body.page;
            try {
                const contentsService = typedi_1.Container.get(contents_admin_service_1.default);
                const { contents, imgFile } = await contentsService.getAll(page);
                response.send(new SuccessResponse_1.default(request, request.params, next).make({ contents, imgFile }, 1));
                if (!contents) {
                    // next(new PostNotFoundException(serialNumber));
                    return;
                }
            }
            catch (e) {
                this.logger.error(e.stack());
                next(new HttpException_1.default(500, e.message, request.params));
            }
        };
        this.getNotice = async (request, response, next) => {
            try {
                const contentsService = typedi_1.Container.get(contents_admin_service_1.default);
                const { notice, imgFile } = await contentsService.getNotice();
                response.send(new SuccessResponse_1.default(request, request.params, next).make({ notice, imgFile }, 1));
            }
            catch (e) {
                this.logger.error(e.stack());
                next(new HttpException_1.default(500, e.message, request.params));
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}/list`, celebrate_1.celebrate({
            body: celebrate_1.Joi.object({
                page: celebrate_1.Joi.number().integer().required(),
            }),
        }), this.getContents);
    }
}
__decorate([
    typedi_1.Inject('logger'),
    __metadata("design:type", Object)
], ContentsController.prototype, "logger", void 0);
exports.default = ContentsController;
//# sourceMappingURL=contents.admin.controller.js.map