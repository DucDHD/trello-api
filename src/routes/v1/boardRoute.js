/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthozired, (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API GET list board' })
  } )
  .post(authMiddleware.isAuthozired, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(authMiddleware.isAuthozired, boardController.getDetails)
  .put(authMiddleware.isAuthozired, boardValidation.update, boardController.update)


// API hỗ trợ việc di chuyển card giữa các column khác nhau trong một board
Router.route('/supports/moving_card')
  .put(authMiddleware.isAuthozired, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)


export const boardRoute = Router