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
const typedi_1 = require("typedi");
class contentsQuery {
    constructor() {
        this.create = () => {
            let query = `INSERT INTO t_nf_log_error 
            (
                status_code, server, id, 
                method, path, header, 
                params, query, payload, 
                response
            )
            VALUES 
            (
            ?, ?, ?, 
            ?, ?, ?, 
            ?, ?, ?, 
            ?
            ) `;
            return query;
        };
    }
}
__decorate([
    typedi_1.Inject('mysql'),
    __metadata("design:type", Object)
], contentsQuery.prototype, "mysql", void 0);
exports.default = contentsQuery;
//# sourceMappingURL=logErr.query.js.map