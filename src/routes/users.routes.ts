// những bộ api nào liên quan đến users thì đều lưu được ở file này
import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
import { register } from 'module'
import { wrapAsync } from '~/utils/handlers'
const usersRouter = Router()

// controller
usersRouter.get('/login', loginValidator, wrapAsync(loginController))
usersRouter.post('/register', registerValidator, wrapAsync(registerController))

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