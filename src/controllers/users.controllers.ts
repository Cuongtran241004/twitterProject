import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'

export const loginController = async (req: Request, res: Response) => {
  // vào req lấy user ra, và lấy _id của user đó
  const { user }: any = req
  const user_id = user._id

  // dùng cái user_id đó tạo access và refresh token
  const result = await userService.login(user_id.toString())
  return res.json({
    message: 'Login successfully!',
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
    message: 'Register successfully!',
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
