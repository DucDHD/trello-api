/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'


// Define collection (Name & scheme)

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict().messages(),
  slug: Joi.string().required().min(3).trim().strict().messages(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).required(),

  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now),
  updateAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)

})
//chỉ định ra những Fields mà chúng ta không muốn cho phép cập nhập trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly:false })
}

const createNew = async (data) => {
  try {
    // Kiểm tra dữ liệu tại model trước khi insert dữ liệu vào DB
    const validData = await validateBeforeCreate(data)
    const createBoard = await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validData)
    return createBoard
  } catch (error) { throw new Error(error) }
}

const findOneById = async (boardId) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(String(boardId)) })
    return result
  } catch (error) { throw new Error(error) }
}

// Query tổng hợp (aggragate) để lấy toàn bộ columns và Cards thuộc về Board
const getDetails = async (id) => {
  try {
    // Hôm nay tạm thời giống hệt hàm findOneById - và sẽ update phần aggragate tiếp ở những video tới
    //const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(String(id)) })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(String(id)),
        _destroy: false
      } },
      { $lookup : {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup : {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } }
    ]).toArray()
    return result[0] || null
  } catch (error) { throw new Error(error) }
}

// Đẩy một phần tử columnId vào cuối mảng columnOrderIds
// Dùng $push trong mongodb ở trường hợp này để đẩy 1 phần tử vào cuối mảng
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(column.boardId)) },
      { $push: { columnOrderIds: new ObjectId(String(column._id)) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}


// Lấy một phần tử columnId ra khỏi mảng columnOrderIds
// dùng $pull trong mongodb ở trường hợp này để lấy một phần tử ra khỏi mảng rối xóa nó đi.
const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(column.boardId)) },
      { $pull: { columnOrderIds: new ObjectId(String(column._id)) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const update = async (boardId, updateData) => {
  try {
    // Lọc những  field mà chúng ta không cho phép cập nhập linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => (new ObjectId(String(_id))))
    }

    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(boardId)) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}


export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds
}
