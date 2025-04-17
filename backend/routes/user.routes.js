import express from 'express'
import { getAllActivitiesController, loginUserController, registerUserController } from '../controllers/user.controller.js'
import authenticateUser from '../middlewares/authenticateUser.middleware.js'

const userRouter = express.Router()

userRouter.post('/register', registerUserController )
userRouter.post('/login',loginUserController)
userRouter.get('/get_all_activities', authenticateUser, getAllActivitiesController)

export default userRouter;