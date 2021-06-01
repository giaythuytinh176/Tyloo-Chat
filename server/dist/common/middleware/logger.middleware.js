"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
function logger(req, res, next) {
    const { method, path } = req;
    console.log(`${method} ${path}`);
    next();
}
exports.logger = logger;
//# sourceMappingURL=logger.middleware.js.map