import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { RegisterReqBody } from '~/models/requests/User.request'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { USERS_MESSAGES } from '~/constants/messages'
config()
class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) }) // override lại date_of_birth, ép kiểu từ stirng về date
    )

    // lấy user_id từ account vừa tạo
    // result này có insertedId là của mongodb
    const user_id = result.insertedId.toString() // lấy user_id từ id mà mongodb đã tạo ra sẵn
    // từ user_id tạo ra access token và refresh token
    // dùng promise.all để chạy song song 2 hàm signAccessToken và signRefreshToken
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )
    return { access_token, refresh_token }
  }

  // Hàm ở users.services.ts có hàm checkEmailExist vì không muốn đụng đến tầng database trực tiếp
  async checkEmailExist(email: string) {
    // vào database tìm user có email này không
    const user = await databaseService.users.findOne({ email })
    return Boolean(user) // nếu tìm được thì true còn không thì false (vì giá trị nhận được là null)
  }
  async login(user_id: string) {
    // dùng user_id để tạo access_token và refresh_token
    // return access_token và refresh_token cho controller
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ token: refresh_token, user_id: new ObjectId(user_id) })
    )
    return { access_token, refresh_token }
    // thiếu bước lưu token vào database
  }
  async logout(refresh_token: string) {
    // tìm và xóa refresh token trong database
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
}
const userService = new UserService()
export default userService
