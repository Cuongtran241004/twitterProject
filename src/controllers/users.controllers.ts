import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.request'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'test@gmail.com' && password === '123456') {
    res.json({
      data: [
        { fname: 'Cường', yob: 2004 },
        { fname: 'Hùng', yob: 2003 },
        { fname: 'Tiến', yob: 2002 }
      ]
    })
  } else {
    res.status(400).json({
      message: 'Login failed!'
    })
  }
}

export const registerController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  try {
    // Tạo 1 user mới và thêm vào collection users trong database
    const result = await userService.register(req.body as RegisterReqBody)
    return res.status(201).json({
      message: 'Register successfully!',
      result
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Register failed!',
      error
    })
  }
}
