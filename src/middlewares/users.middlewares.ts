// 1 ai đó truy cập vào /login
// client sẽ gửi cho mình email và password
// client gửi 1 request lên server
// thì email và password sẽ được lưu ở request.body
// viết 1 middleware để xử lí validator của request body
import { checkSchema } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { validate } from '~/utils/validation'
import userService from '~/services/users.services'
// Express sẽ có các interface để định nghĩa req, res, next

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  // nếu email hoặc password không tồn tại
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password must be required!'
    })
  }
  // nếu không bị lỗi thì được xuống tầng tiếp theo
  next()
}
// viết confirm_password: vì theo quy định của mongodb
// khi register thì ta sẽ có 1 req.body gồm
// {
// name: string,
// email: string,
// password: string,
// confirm_password:
// string, date_of_birth: ISO8601}

// hàm validate: nếu trong quá trình checkSchema có lỗi thì validate kêu checkschema lưu lỗi ở req và validate sẽ in thông báo lỗi ra
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          // kiểm tra xem email đã tồn tại hay chưa
          const isEmailExist = await userService.checkEmailExist(value)
          if (isEmailExist) {
            throw new Error('Email already exists')
          } else {
            return true
          }
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1
        }
      },
      errorMessage: 'Password must be at least 8 characters long, 1 lowercase, 1 uppercase, 1 number and 1 symbol'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1
        }
      },
      errorMessage:
        'Confirm-password must be at least 8 characters long, 1 lowercase, 1 uppercase, 1 number and 1 symbol',
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm password does not match password')
          } else {
            return true
          }
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true, //strict là kiểm tra định dạng ngày tháng năm, ví dụ 2020-12-12T00:00:00.000Z
          strictSeparator: true // strictSeparator là kiểm tra định dạng dấu phân cách, ví dụ 2020-12-12
        }
      }
    }
  })
)
