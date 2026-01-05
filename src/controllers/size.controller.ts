import { Request, Response } from "express";
import { getAllSizes } from "~/services/size.services";
import HttpStatus from "~/utlis/statusMap";

class Size 
{
    static async getAllSizes(req: Request, res: Response)
    {
        const responseData = await getAllSizes();

        if (responseData)
            return res
                .status(responseData.httpStatus)
                .json(responseData);

        return res
            .status(HttpStatus.INTERNAL)
            .json({
                success: false,
                message: "Internal Server Error"
            });
    }
}

export default Size;
