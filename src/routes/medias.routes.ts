import { Router } from 'express'
import { wrapAsync } from '~/utils/handlers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { uploadVideoController } from '~/controllers/medias.controllers'
const mediasRouter = Router()

// cmt dòng này và fix thành
// mediasRouter.post('/upload-image', wrapAsync(uploadSingleImageController))
//từ dòng này ta xóa chữ Single trong tên của controller
import { uploadImageController } from '~/controllers/medias.controllers'

mediasRouter.post('/upload-image', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadImageController))
//thêm middlewares  accessTokenValidator, verifiedUserValidator để đảm bảo rằng, phải đăng nhập mới đc đăng ảnh
mediasRouter.post('/upload-video', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadVideoController))

export default mediasRouter

//uploadSingleImageController chưa làm
