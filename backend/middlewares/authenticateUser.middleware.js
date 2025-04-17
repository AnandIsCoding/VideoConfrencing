import chalk from "chalk"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authenticateUser = async(req,res,next) =>{
    try {
        if(!req.cookies || !req.cookies.userToken){
            return res.status(401).json({success:false,message:'Unauthorized: No Token provided',error:'Unauthorized: No Token Provided'})
        }
        //extract userToken from cookies
        const {userToken} = req.cookies
        if(!userToken) return res.status(401).json({success:false,message:'Unauthorized: No Token provided',error:'Unauthorized: No Token Provided'})
        // verify userToken using jwt
        const decodedData = jwt.verify(userToken, process.env.SECRET_KEY)
        const _id = decodedData._id
        req.body = { ...req.body, userId: _id };
        return next()
    } catch (error) {
        console.error('Error in authenticateUser middleware: ', error)

        if (error instanceof jwt.JsonWebTokenError) {
            // JWT-related errors (e.g., invalid token or expired)
            return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' })
        }
        // Handle specific error if server connection is lost
        if (error.code === 'ECONNRESET') {
            return res.status(500).json({ success: false, message: 'Internal server error: Connection reset' })
        }

        // General error handling
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

export default authenticateUser