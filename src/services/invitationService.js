import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { invitationModel } from '~/models/invitationModel'
import { pickUser } from '~/utils/formatters'
import { userModel } from '~/models/userModel'
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'

const createNewBoardInvitation = async ( reqBody, inviterId ) => {
  try {
    // Người đi mới : chính là người đang request, nên chúng ta ta tìm theo id lấy từ token
    const inviter = await userModel.findOneById(inviterId)
    // Người được mới: lấy theo email nhận từ phía FE
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    // Tìm luôn cái board ra để lấy data xử lý
    const board = await boardModel.findOneById(reqBody.boardId)

    // Nếu không tồn tại 1 trong 3 thì cứ thẳng tay reject
    if (!inviter || !invitee || !board ) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, Invitee or board not found!')
    }
    // Tạo data cần thiết để lưu vào trong DB
    // Có thể thử bỏ hoặc làm sai lệch type, boardInvitation, status để test xem Model validate ok chưa

    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(), // Chuyển từ ObjectId về string vì sang bên Model có check lại data ở hàm Create
      type:INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId : board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    // Gọi sang Model để lưu vào DB
    const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    // Ngoài thông tin của cái board invitation mới tạo thì trả về đủ cả luôn board, inviter, invitee cho FE thoái mãi xử lý
    const resInvitation ={
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }
    return resInvitation

  } catch (error) { throw error }
}

const getInvitations = async(userId) => {
  try {
    const getInvitations = await invitationModel.findbyUser(userId)
    // Vì các dữ liệu inviter, invitee và board là đang ở giá trị 1 phần tử nến lấy ra được nên chúng ta biến đổi nó về Json Object trước khi trả về FE
    // const resInvitations = getInvitations.map( i => {
    //   return {
    //     ...i,
    //     inviter: i.inviter[0] || {},
    //     invitee: i.invitee[0] || {},
    //     board: i.board[0] || {}
    //   }
    // })
    const resInvitations = getInvitations.map( i => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {}
    }))

    return resInvitations
  } catch (error) { throw error }
}

export const invitationService = {
  createNewBoardInvitation,
  getInvitations
}