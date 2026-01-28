import muiter from 'multer'
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES } from '~/utils/validators'

/**
 * Hầu hết những thứ bên dưới đầu có ở docs của Multer, chỉ là anh tổ chức lại sao cho khóa học gọn gàng nhất có thẻ
 */

// Function kiểm tra loại file nào được chấp nhận


// Đới với Multer, kiểm tra kiểu file thì sử dụng mimetype
const customFileFilter = (req, file, callback) => {
  //console.log('Multer File :', file)
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(errMessage, null)
  }
  // Nếu như kiểu file hợp lệ:
  return callback(null, true)
}

// Khởi tạo Func upload được bọc bởi thằng multer

const upload = muiter({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddleware = {
  upload
}