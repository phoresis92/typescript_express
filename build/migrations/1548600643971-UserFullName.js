"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserFullName1548600643971 {
    async up(queryRunner) {
        await queryRunner.renameColumn('user', 'name', 'fullName');
    }
    async down(queryRunner) {
        await queryRunner.renameColumn('user', 'fullName', 'name');
    }
}
exports.UserFullName1548600643971 = UserFullName1548600643971;
//# sourceMappingURL=1548600643971-UserFullName.js.map