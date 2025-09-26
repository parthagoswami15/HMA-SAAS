"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationType = exports.CredentialType = exports.LeaveType = exports.LeaveRequestStatus = exports.CredentialStatus = exports.AttendanceStatus = exports.ShiftType = exports.StaffStatus = exports.StaffType = void 0;
var StaffType;
(function (StaffType) {
    StaffType["DOCTOR"] = "DOCTOR";
    StaffType["NURSE"] = "NURSE";
    StaffType["ADMINISTRATOR"] = "ADMINISTRATOR";
    StaffType["RECEPTIONIST"] = "RECEPTIONIST";
    StaffType["LAB_TECHNICIAN"] = "LAB_TECHNICIAN";
    StaffType["PHARMACIST"] = "PHARMACIST";
    StaffType["SUPPORT_STAFF"] = "SUPPORT_STAFF";
})(StaffType || (exports.StaffType = StaffType = {}));
var StaffStatus;
(function (StaffStatus) {
    StaffStatus["ACTIVE"] = "ACTIVE";
    StaffStatus["ON_LEAVE"] = "ON_LEAVE";
    StaffStatus["SUSPENDED"] = "SUSPENDED";
    StaffStatus["TERMINATED"] = "TERMINATED";
    StaffStatus["RETIRED"] = "RETIRED";
})(StaffStatus || (exports.StaffStatus = StaffStatus = {}));
var ShiftType;
(function (ShiftType) {
    ShiftType["MORNING"] = "MORNING";
    ShiftType["EVENING"] = "EVENING";
    ShiftType["NIGHT"] = "NIGHT";
    ShiftType["ROTATIONAL"] = "ROTATIONAL";
    ShiftType["CUSTOM"] = "CUSTOM";
})(ShiftType || (exports.ShiftType = ShiftType = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["HALF_DAY"] = "HALF_DAY";
    AttendanceStatus["ON_LEAVE"] = "ON_LEAVE";
    AttendanceStatus["HOLIDAY"] = "HOLIDAY";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var CredentialStatus;
(function (CredentialStatus) {
    CredentialStatus["PENDING_VERIFICATION"] = "PENDING_VERIFICATION";
    CredentialStatus["VERIFIED"] = "VERIFIED";
    CredentialStatus["EXPIRED"] = "EXPIRED";
    CredentialStatus["REJECTED"] = "REJECTED";
    CredentialStatus["SUSPENDED"] = "SUSPENDED";
})(CredentialStatus || (exports.CredentialStatus = CredentialStatus = {}));
var LeaveRequestStatus;
(function (LeaveRequestStatus) {
    LeaveRequestStatus["PENDING"] = "PENDING";
    LeaveRequestStatus["APPROVED"] = "APPROVED";
    LeaveRequestStatus["REJECTED"] = "REJECTED";
    LeaveRequestStatus["CANCELLED"] = "CANCELLED";
})(LeaveRequestStatus || (exports.LeaveRequestStatus = LeaveRequestStatus = {}));
var LeaveType;
(function (LeaveType) {
    LeaveType["ANNUAL"] = "ANNUAL";
    LeaveType["SICK"] = "SICK";
    LeaveType["MATERNITY"] = "MATERNITY";
    LeaveType["PATERNITY"] = "PATERNITY";
    LeaveType["STUDY"] = "STUDY";
    LeaveType["UNPAID"] = "UNPAID";
    LeaveType["OTHER"] = "OTHER";
})(LeaveType || (exports.LeaveType = LeaveType = {}));
var CredentialType;
(function (CredentialType) {
    CredentialType["MEDICAL_LICENSE"] = "MEDICAL_LICENSE";
    CredentialType["DEGREE"] = "DEGREE";
    CredentialType["CERTIFICATION"] = "CERTIFICATION";
    CredentialType["ID_PROOF"] = "ID_PROOF";
    CredentialType["ADDRESS_PROOF"] = "ADDRESS_PROOF";
    CredentialType["OTHER"] = "OTHER";
})(CredentialType || (exports.CredentialType = CredentialType = {}));
var LocationType;
(function (LocationType) {
    LocationType["HOSPITAL"] = "HOSPITAL";
    LocationType["CLINIC"] = "CLINIC";
    LocationType["LAB"] = "LAB";
    LocationType["PHARMACY"] = "PHARMACY";
    LocationType["ADMIN_OFFICE"] = "ADMIN_OFFICE";
    LocationType["OTHER"] = "OTHER";
})(LocationType || (exports.LocationType = LocationType = {}));
//# sourceMappingURL=index.js.map