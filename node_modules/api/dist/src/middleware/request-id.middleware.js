"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdMiddleware = requestIdMiddleware;
const uuid_1 = require("uuid");
function requestIdMiddleware(req, res, next) {
    const incoming = req.headers['x-request-id'] || undefined;
    const id = incoming || (0, uuid_1.v4)();
    req.requestId = id;
    res.setHeader('X-Request-Id', id);
    next();
}
//# sourceMappingURL=request-id.middleware.js.map