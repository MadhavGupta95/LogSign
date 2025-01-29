import jwt from "jsonwebtoken"

const secret = "AnyThin$#@9837_ab"

export const generateToken = (payload)=>{
    return jwt.sign(payload, secret, {
        expiresIn:'1h',
    })
}

export const verifyToken = (token)=>{
    try {
        const payload = jwt.verify(token, secret)
        return payload
    } catch (error) {
        console.log(error);
        return null
    }
}