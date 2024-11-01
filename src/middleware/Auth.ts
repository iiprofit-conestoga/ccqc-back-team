import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { getHandlerResponseObject, httpStatus } from '../helper/Index';


// // Middleware generator
// const checkPermission = (requiredPermission: string) => {
//     // Returned middleware
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             if (!req.user || !req.user.role) {
//                 return res.status(401).send('User not authenticated or role not found');
//             }

//             // Fetch user's role and populate permissions
//             const userRole = await RolesModel.findById(req.user.role).populate('permissions');

//             // Check for the required permission
//             if (userRole && userRole.permissions.some(permission => permission === requiredPermission)) {
//                 next(); // Permission found, proceed
//             } else {
//                 res.status(403).send('Access Denied'); // Permission not found
//             }
//         } catch (error) {
//             // Handle potential errors, like database issues
//             res.status(500).send('Internal Server Error');
//         }
//     };
// };


const jwtVerify = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, username: any) => {
            if (err) {
                const { code, data, message } = getHandlerResponseObject(
                    false,
                    httpStatus.UNAUTHORIZED,
                    "User Unauthorized",
                    err
                );

                return res.status(code).json({ code, data, message });
            }
            req.user = username;
            next();
        });
    } else {
        const { code, data, message } = getHandlerResponseObject(
            true,
            httpStatus.OK,
            "User Unauthorized"
        );
        return res.status(code).json({ code, message, data });
    }
}

export { jwtVerify }
