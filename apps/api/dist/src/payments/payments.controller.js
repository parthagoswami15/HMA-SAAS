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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const class_validator_1 = require("class-validator");
class CheckoutDto {
    planCode;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "planCode", void 0);
let PaymentsController = class PaymentsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    listPlans() { return this.svc.listActivePlans(); }
    getSub(tenantId) { return this.svc.getSubscription(tenantId); }
    change(tenantId, dto) { return this.svc.changePlan(tenantId, dto.planCode); }
    cancel(tenantId) { return this.svc.cancelSubscription(tenantId); }
    checkout(tenantId, dto) {
        return this.svc.createCheckoutSession(tenantId, dto.planCode);
    }
    async webhook(req, res) {
        const signature = req.headers['x-razorpay-signature'];
        const raw = req.rawBody?.toString() || JSON.stringify(req.body);
        const valid = await this.svc.verifyWebhook(signature, raw);
        if (!valid)
            return res.status(400).send('Invalid signature');
        await this.svc.handleWebhookParsed(req.body);
        return res.status(200).json({ received: true });
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "listPlans", null);
__decorate([
    (0, common_1.Get)('subscription'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getSub", null);
__decorate([
    (0, common_1.Post)('subscription/change'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CheckoutDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "change", null);
__decorate([
    (0, common_1.Delete)('subscription'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Headers)('x-tenant-id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CheckoutDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "checkout", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "webhook", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map