// những bộ api nào liên quan đến users thì đều lưu được ở file này
import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
import { register } from 'module'
const usersRouter = Router()

// controller
usersRouter.get('/login', loginValidator, loginController)
usersRouter.post('/register', registerValidator, registerController)
export default usersRouter
