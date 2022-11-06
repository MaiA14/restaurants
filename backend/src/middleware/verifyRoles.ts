import jwt from 'jsonwebtoken';
require('dotenv').config();

export default class VerifyRoles {

    static verifyRoles = (...allowedRoles: any) => {
        return (req: any, res: any, next: any) => {
            console.log(allowedRoles);
            if (!req?.role) {
                console.log('roles ', req.role);
                return res.status(401).send();
            }

            console.log(req.role);

            if (allowedRoles.includes(req.role)) {
                next();
            } else {
                return res.status(401).json({ 'message': 'Premission denied.' })
            }
        }
    }
}

