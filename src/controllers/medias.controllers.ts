import { Request, Response, NextFunction } from 'express'
import formidable from 'formidable'
import path from 'path'
import { handleUploadImage } from '~/utils/file'
import { getNameFromFullname } from '~/utils/file'
import { UPLOAD_DIR, UPLOAD_TEMP_DIR } from '~/constants/dir'
import mediasService from '~/services/medias.services'
import { USERS_MESSAGES } from '~/constants/messages'
// console.log(__dirname) //log thử để xem
// console.log(path.resolve()) //D:\toturalReact2022\nodejs-backend\ch04-tweetProject
// console.log(path.resolve('uploads')) //D:\toturalReact2022\nodejs-backend\ch04-tweetProject\uploads

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req) //đã xóa chữ Single,
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}
//khỏi async vì có đợi gì đâu
export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { namefile } = req.params //lấy namefile từ param string
  res.sendFile(path.resolve(UPLOAD_DIR, namefile), (error) => {
    console.log(error) //xem lỗi trong như nào, nếu ta bỏ sai tên file / xem xong nhớ cmt lại cho đở rối terminal
    if (error) {
      return res.status((error as any).status).send('File not found')
    }
  }) //trả về file
}