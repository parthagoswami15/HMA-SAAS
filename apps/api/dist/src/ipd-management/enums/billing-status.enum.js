"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingStatus = void 0;
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["DRAFT"] = "DRAFT";
    BillingStatus["PENDING"] = "PENDING";
    BillingStatus["PROCESSING"] = "PROCESSING";
    BillingStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    BillingStatus["PAID"] = "PAID";
    BillingStatus["VOIDED"] = "VOIDED";
    BillingStatus["REFUNDED"] = "REFUNDED";
    BillingStatus["WRITTEN_OFF"] = "WRITTEN_OFF";
    BillingStatus["INSURANCE_PENDING"] = "INSURANCE_PENDING";
    BillingStatus["INSURANCE_APPROVED"] = "INSURANCE_APPROVED";
    BillingStatus["INSURANCE_REJECTED"] = "INSURANCE_REJECTED";
    BillingStatus["INSURANCE_PAID"] = "INSURANCE_PAID";
    BillingStatus["DISPUTED"] = "DISPUTED";
    BillingStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    BillingStatus["SENT_TO_COLLECTIONS"] = "SENT_TO_COLLECTIONS";
    BillingStatus["COLLECTION_IN_PROGRESS"] = "COLLECTION_IN_PROGRESS";
    BillingStatus["OTHER"] = "OTHER";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
//# sourceMappingURL=billing-status.enum.js.map