"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceType = exports.RegistrationType = exports.MaritalStatus = exports.BloodType = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["OTHER"] = "OTHER";
    Gender["UNKNOWN"] = "UNKNOWN";
})(Gender || (exports.Gender = Gender = {}));
var BloodType;
(function (BloodType) {
    BloodType["A_POSITIVE"] = "A_POSITIVE";
    BloodType["A_NEGATIVE"] = "A_NEGATIVE";
    BloodType["B_POSITIVE"] = "B_POSITIVE";
    BloodType["B_NEGATIVE"] = "B_NEGATIVE";
    BloodType["AB_POSITIVE"] = "AB_POSITIVE";
    BloodType["AB_NEGATIVE"] = "AB_NEGATIVE";
    BloodType["O_POSITIVE"] = "O_POSITIVE";
    BloodType["O_NEGATIVE"] = "O_NEGATIVE";
    BloodType["UNKNOWN"] = "UNKNOWN";
})(BloodType || (exports.BloodType = BloodType = {}));
var MaritalStatus;
(function (MaritalStatus) {
    MaritalStatus["SINGLE"] = "SINGLE";
    MaritalStatus["MARRIED"] = "MARRIED";
    MaritalStatus["DIVORCED"] = "DIVORCED";
    MaritalStatus["WIDOWED"] = "WIDOWED";
    MaritalStatus["SEPARATED"] = "SEPARATED";
    MaritalStatus["DOMESTIC_PARTNERSHIP"] = "DOMESTIC_PARTNERSHIP";
    MaritalStatus["UNKNOWN"] = "UNKNOWN";
})(MaritalStatus || (exports.MaritalStatus = MaritalStatus = {}));
var RegistrationType;
(function (RegistrationType) {
    RegistrationType["WALK_IN"] = "WALK_IN";
    RegistrationType["ONLINE"] = "ONLINE";
    RegistrationType["REFERRAL"] = "REFERRAL";
    RegistrationType["TRANSFER"] = "TRANSFER";
    RegistrationType["OTHER"] = "OTHER";
})(RegistrationType || (exports.RegistrationType = RegistrationType = {}));
var InsuranceType;
(function (InsuranceType) {
    InsuranceType["PRIVATE"] = "PRIVATE";
    InsuranceType["GOVERNMENT"] = "GOVERNMENT";
    InsuranceType["CORPORATE"] = "CORPORATE";
    InsuranceType["NONE"] = "NONE";
    InsuranceType["OTHER"] = "OTHER";
})(InsuranceType || (exports.InsuranceType = InsuranceType = {}));
//# sourceMappingURL=patient.enums.js.map