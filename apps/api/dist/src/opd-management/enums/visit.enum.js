"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuePriority = exports.VisitType = exports.VisitStatus = void 0;
var VisitStatus;
(function (VisitStatus) {
    VisitStatus["REGISTERED"] = "REGISTERED";
    VisitStatus["TRIAGE"] = "TRIAGE";
    VisitStatus["WAITING"] = "WAITING";
    VisitStatus["IN_CONSULTATION"] = "IN_CONSULTATION";
    VisitStatus["COMPLETED"] = "COMPLETED";
    VisitStatus["CANCELLED"] = "CANCELLED";
    VisitStatus["NO_SHOW"] = "NO_SHOW";
    VisitStatus["ADMITTED"] = "ADMITTED";
    VisitStatus["REFERRED"] = "REFERRED";
})(VisitStatus || (exports.VisitStatus = VisitStatus = {}));
var VisitType;
(function (VisitType) {
    VisitType["OPD"] = "OPD";
    VisitType["EMERGENCY"] = "EMERGENCY";
    VisitType["FOLLOW_UP"] = "FOLLOW_UP";
    VisitType["REFERRAL"] = "REFERRAL";
    VisitType["WALK_IN"] = "WALK_IN";
    VisitType["APPOINTMENT"] = "APPOINTMENT";
})(VisitType || (exports.VisitType = VisitType = {}));
var QueuePriority;
(function (QueuePriority) {
    QueuePriority["NORMAL"] = "NORMAL";
    QueuePriority["URGENT"] = "URGENT";
    QueuePriority["EMERGENCY"] = "EMERGENCY";
    QueuePriority["PEDIATRIC"] = "PEDIATRIC";
    QueuePriority["GERIATRIC"] = "GERIATRIC";
    QueuePriority["PREGNANT"] = "PREGNANT";
    QueuePriority["DISABLED"] = "DISABLED";
})(QueuePriority || (exports.QueuePriority = QueuePriority = {}));
//# sourceMappingURL=visit.enum.js.map