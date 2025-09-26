"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientDocumentsService = void 0;
exports.PatientDocumentsService = jest.fn().mockImplementation(() => ({
    uploadDocument: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
}));
//# sourceMappingURL=patient-documents.service.js.map