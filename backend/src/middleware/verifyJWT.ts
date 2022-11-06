import jwt from 'jsonwebtoken';
require('dotenv').config();

export default class VerifyJWT {

    public static async verifyJWT(req: any, res: any, next: any) {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 'message': 'Unauthorized.'}); 
        };
        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err: any, decoded: any) => {
                if (err) {
                    //invalid token
                    return res.status(401).json({ 'message': 'Unauthorized.'}); 
                }
                req.role = decoded.UserInfo.role;
                next();
            }
        );
    }

}