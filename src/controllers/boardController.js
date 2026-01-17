/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body', req.body)
    // console.log('req.query', req.query)
    // console.log('req.params', req.params)

    //throw new ApiError(StatusCodes.BAD_GATEWAY, 'DucDH Test Error')
    res.status(StatusCodes.CREATED).json({ message: 'Post from Controller: API CreaAte list board' })
  } catch (error) { next(error) }
}


export const boardController = {
  createNew
}