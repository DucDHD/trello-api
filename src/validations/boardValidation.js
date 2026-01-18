/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

const createNew = async (req, res, next) => {
  /**
   * Note: Mặc định chúng ta không cần phải custom message ở phí BE làm gì vì để cho Front-end tự validate và custom message phía FE cho đẹp
   * Back-End chỉ cần validate đảm bảo dữ liệu chuẩn xác, và trả về message mặc định từ thư viện là được.
   * Quan trọng: Việc validate dữ liệu bắt buộc phải có phía BE vì đây là điểm cuối để lưu trữ liệu vào database.
   * Và thông thường trong thực tế, điều tốt nhất cho hệ thống là hãy luôn validate dữ liệu ở BE và FE.
   */
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required' : 'Title is required',
      'string.empty' : 'Title is not allowed to be empty',
      'string.min'   : 'Title min 3 chars',
      'string.max'   : 'Title max 50 chars',
      'string.trim'  : 'Title must not have leading or trailing whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC,BOARD_TYPES.PRIVATE).required()

  })
  try {
    // chỉ định abortEarly: false để trường hợp có nhiều lỗi validation thì trả về tất cả
    await correctCondition.validateAsync(req.body, { abortEarly:false })
    // Validate dữ liệu xong xuôi hợp lệ thì cho request đi tiếp Controller
    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }

}

export const boardValidation = {
  createNew
}