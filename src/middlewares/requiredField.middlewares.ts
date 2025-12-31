import { Request, Response, NextFunction } from "express";
import HttpStatus from "~/utlis/statusMap";
//Kien thuc ve interface ve enum 
function requireFields(fields: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const missingFields = fields.filter(
            field => req.body[field] === undefined || req.body[field] === null
        );
        if (missingFields.length > 0) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        next();
    };
}

export { requireFields };
