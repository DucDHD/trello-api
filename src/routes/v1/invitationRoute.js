import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationValidation } from '~/validations/invitationValidation'
import { invitationController } from '~/controllers/invitationController'

const Router = express.Router()

Router.route('/board')
  .post(
    authMiddleware.isAuthozired,
    invitationValidation.createNewBoardInvitation,
    invitationController.createNewBoardInvitation
  )

export const invitationRoute = Router