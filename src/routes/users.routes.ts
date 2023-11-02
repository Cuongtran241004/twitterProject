// những bộ api nào liên quan đến users thì đều lưu được ở file này
import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
import { register } from 'module'
import { wrapAsync } from '~/utils/handlers'
import { logoutController } from '~/controllers/users.controllers'
import {
  accessTokenValidator,
  refreshTokenValidator,
  forgotPasswordValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { emailVerifyValidator, resetPasswordValidator } from '~/middlewares/users.middlewares'
import {
  emailVerifyController,
  resendEmailVerifyController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  resetPasswordController,
  getMeController
} from '~/controllers/users.controllers'
const usersRouter = Router()

// controller
usersRouter.get('/login', loginValidator, wrapAsync(loginController))
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
/**
 * description: Logout
 * path: /users/logout
 * method: POST
 * Header: { Authorization: 'Bearer <access_token>' }
 * Body: {refresh_token: string} // mỗi thiết bị sẽ có 1 refresh_token
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/**
 * des: verify email
 * khi người dùng đăng ký, trong email của họ sẽ có 1 link verify email
 * trong link này đã setup sẵn 1 request kèm cái email_verify_token thì verify email là cái route cho request đó
 * method: POST
 * path: /users/verify-email
 * body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyValidator, wrapAsync(emailVerifyController))

/**
 * des: resend email verify
 * method: POST
 * header: {Authorization: Bearer <access_token>}
 */
usersRouter.post('/resend-email-verify', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/**
 * des: forgot password
 * khi người dùng quên mật khẩu, họ sẽ gửi 1 request với email của họ
 * server sẽ tạo 1 forgot_password_token và gửi vào email của họ
 * method: POST
 * path: /users/forgot-password
 * body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/**
 * des: verify forgot password token
 * người dùng sau khi báo forgot password, họ sẽ nhận được 1 email với link verify forgot password token
 * nếu thành công thì họ sẽ được reset password
 * method: POST
 * path: /users/verify-forgot-password-token
 * body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
)
/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))
// usersRouter.post(
//   '/register',
//   registerValidator,
//   // hàm này không được dùng async khi throw new Error
//   (req, res, next) => {
//     console.log('Req 1')
//     next(new Error('Error 1')) // nó sẽ tìm thằng error handler gần nhất để xử lý
//     // throw new Error('Error 1') // nó sẽ tìm thằng error handler gần nhất để xử lý
//   },
//   (req, res, next) => {
//     console.log('Req 2')
//     next()
//   },
//   (req, res, next) => {
//     console.log('Req 3')
//     res.json({ message: 'Register successfully' })
//   },
//   //error handler
//   (err, req, res, next) => {
//     console.log(err.message)
//     res.status(400).json({ message: err.message })
//   }
// )
export default usersRouter
