import { Request, Response, NextFunction } from 'express'
import { omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

// nơi tập kết lỗi từ mọi nơi trên hệ thống
export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // nếu lỗi nhận được thuộc dạng ErrorWithStatus thì trả về status và message
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, ['status']))
  }
  // còn nếu code mà chạy xuống đây thì error sẽ là 1 lỗi mặc định
  // err(message, stack, name) 3 thuộc tính này có enumerable: false ==> không thể truy cập được nó
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  // trả về lỗi mặc định
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack'])
  })
}
