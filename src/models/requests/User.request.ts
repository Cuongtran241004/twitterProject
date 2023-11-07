import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import User from '../schemas/User.schema'
import { UserVerifyStatus } from '~/constants/enums'
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}
export interface LoginReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
}
export interface EmailVerifyReqBody {
  email_verify_token: string
}
export interface ForgotPasswordReqBody {
  email: string
}
export interface VerifyForgotPasswordTokenReqBody {
  forgot_password_token: string
}
export interface ResetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}
export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string //vì ngta truyền lên string dạng ISO8601, k phải date
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}
export interface GetProfileReqParams {
  username: string
}

export interface FollowReqBody {
  followed_user_id: string
}
