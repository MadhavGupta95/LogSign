import { verifyToken } from "../utils/jwt.js";

export const isAuthorized = async(req, res, next)=>{
    try {
        const token = req.headers.authorization
        const decodedToken = verifyToken(token)
        if(!decodedToken){
            return res.json({
                message:"Unauthorized",
                success:false
        })
    }
    req.user = decodedToken
    next()
        
    } catch (error) {
        console.log(error);
        return res.json({
            message:"Error in middleware",
            success: false
        })
    }
}