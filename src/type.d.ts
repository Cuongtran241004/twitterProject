// định nghĩa lại những module mà express không có sẵn
import { Request } from 'express'
import { User } from '~/models/User'

declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
