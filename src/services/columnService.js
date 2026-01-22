/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // Xử lý cấu trúc data ở đây trước khi trả dữ liệu về
      getNewColumn.cards = []

      // Cập nhập mảng columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error}
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    const updateColumn= await columnModel.update(columnId, updateData)
    return updateColumn
  } catch (error) {
    throw error
  }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    // Xóa Column
    await columnModel.deleteOneById(columnId)
    // Xóa toàn bộ Cards thuộc column trên
    await cardModel.deleteManyByColumnId(columnId)

    // Xóa columnId trong mảng columnOrderIds của board chứa nó
    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'ColumnId its cards deleted successfully!' }
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}