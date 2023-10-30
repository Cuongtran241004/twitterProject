import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { resolve } from 'path'
import { TokenPayload } from '~/models/requests/User.request'
config()
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      resolve(token as string)
    })
  })
}
// hàm kiểm tra token có phải mình tạo ra hay không. Nếu có thì trả ra payload
// định nghĩa như vậy để có thể gán giá trị default
export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey as string, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as TokenPayload)
    })
  })
}
