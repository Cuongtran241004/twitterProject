import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  EmailVerifyReqBody,
  ForgotPasswordReqBody,
  GetProfileReqParams,
  LoginReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UpdateMeReqBody,
  FollowReqBody
} from '~/models/requests/User.request'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'
import { pick } from 'lodash'

export const loginController = async (req: Request, res: Response) => {
  // vào req lấy user ra, và lấy _id của user đó
  const user = req.user as User

  const user_id = user._id as ObjectId

  // dùng cái user_id đó tạo access và refresh token
  // login nhận vào 1 string nên ta phải .toString() để ép kiểu ObjectId về string
  const result = await userService.login({ user_id: user_id.toString(), verify: user.verify as UserVerifyStatus })
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
export const emailVerifyController = async (req: Request<ParamsDictionary, any, EmailVerifyReqBody>, res: Response) => {
  // khi mà request vào được đây nghĩa là email_verify_token đã valid
  // đồng thời trong request sẽ có decoded_email_verify_token
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  // tìm xem có user có mã này không
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  // nếu có user đó thì mình sẽ kiểm tra xem user đó có lưu email_verify_token không
  if (user.email_verify_token === '') {
    return res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }

  // nếu xuống được đây nghĩa là user này hợp lệ và account chưa verify
  // verifyEmail(user_id) là: tìm user đó bằng user_id và update lại email_verify_token thành ''
  // và verify: 1
  const result = await userService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}
export const resendEmailVerifyController = async (req: Request, res: Response) => {
  // nếu qua được hàm này thì đã qua được accessTokenValidator
  // req đã có decoded_authorization
  const { user_id } = req.decoded_authorization as TokenPayload
  // tìm user có user_id này
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })
  // nếu không có user này thì trả về lỗi
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: USERS_MESSAGES.USER_NOT_FOUND })
  }
  // nếu có user này thì kiểm tra xem user này đã verify email chưa
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({ message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE })
  }
  // nếu chưa verify thì gửi lại email verify
  const result = await userService.resendEmailVerify(user_id)
  return res.json({ result })
}
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  // vì đã qua forgotPasswordValidator nên đã có user trong req
  const { _id, verify } = req.user as User
  // tiến hành tạo forgot_password_token và gửi vào email của user
  const result = await userService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.json(result)
}
export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  res.json({ message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS })
}
// nên định nghĩa req body khi controller sử dụng body
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  // dủng user_id đó để tìm user và update lại password
  const result = await userService.resetPassword({ user_id, password })
  return res.json(result)
}
export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  // vào database tìm user có user_id mà đưa cho client
  const user = await userService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}
export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  const result = await userService.updateMe(user_id, body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
}
export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response) => {
  const { username } = req.params
  const result = await userService.getProfile(username)
  return res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result
  })
}
export const followController = async (
  req: Request<ParamsDictionary, any, FollowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload //lấy user_id từ decoded_authorization của access_token
  const { followed_user_id } = req.body //lấy followed_user_id từ req.body
  const result = await userService.follow(user_id, followed_user_id) //chưa có method này
  return res.json(result)
}
