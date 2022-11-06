"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
class VerifyRoles {
}
exports.default = VerifyRoles;
VerifyRoles.verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(allowedRoles);
        if (!(req === null || req === void 0 ? void 0 : req.role)) {
            console.log('roles ', req.role);
            return res.status(401).send();
        }
        console.log(req.role);
        if (allowedRoles.includes(req.role)) {
            next();
        }
        else {
            return res.status(401).json({ 'message': 'Premission denied.' });
        }
    };
};
