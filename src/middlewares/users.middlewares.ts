// 1 ai đó truy cập vào /login
// client sẽ gửi cho mình email và password
// client gửi 1 request lên server
// thì email và password sẽ được lưu ở request.body
// viết 1 middleware để xử lí validator của request body
import { checkSchema } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { validate } from '~/utils/validation'
import userService from '~/services/users.services'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { has } from 'lodash'
import { hashPassword } from '~/utils/crypto'
// Express sẽ có các interface để định nghĩa req, res, next

export const loginValidator = validate(
  checkSchema({
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await databaseService.users.findOne({
            email: value,
            password: hashPassword(req.body.password)
          })

          if (user === null) {
            throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
          }
          req.user = user // lưu user vào req để dùng ở loginController
          return true
        }
      }
    }
  })
)
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
      notEmpty: {
        errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
      },
      trim: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
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
            throw new Error('Email already exists!')
          }
          return true
        },
        errorMessage: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
      }
    },
    password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
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
      errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
    },
    confirm_password: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1,
          minNumbers: 1
        },
        errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
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
        },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
      }
    }
  })
)
