import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody, RegisterReqBody } from '~/models/requests/User.request'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  // vào req lấy user ra, và lấy _id của user đó
  const user = req.user as User

  const user_id = user._id as ObjectId

  // dùng cái user_id đó tạo access và refresh token
  // login nhận vào 1 string nên ta phải .toString() để ép kiểu ObjectId về string
  const result = await userService.login(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  // Tạo 1 user mới và thêm vào collection users trong database
  const result = await userService.register(req.body as RegisterReqBody)
  return res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result: result
  })
  // } catch (error) {
  //   console.log(error)
  //   return res.status(400).json({
  //     message: 'Register failed!',
  //     error
  //   })
  // }
}
export const logoutController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const refresh_token = req.body.refresh_token
  // tìm và xóa refresh token trong database
  const result = await userService.logout(refresh_token)
  res.json(result)
}
