'use server'

import { revalidatePath } from 'next/cache'
import { ID, Query } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'

import { getCurrentUser } from '@/lib/actions/user.actions'
import { createAdminClient } from '@/lib/appwrite'
import { appwriteConfig } from '@/lib/appwrite/config'
import {
  constructFileUrl,
  getFileType,
  handleError,
  parseStringify,
} from '@/lib/utils'

// 上传文件
export const uploadFile = async (props: UploadFileProps) => {
  const { file, ownerId, accountId, path } = props

  const { storage, databases } = await createAdminClient()

  try {
    // 读取文件到文件缓冲区
    const inputFile = InputFile.fromBuffer(file, file.name)
    // 创建文件
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    )
    // 描述文件以存入数据库
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    }

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        // 上传文件失败时，删除文件
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id)
        handleError(error, '创建文件失败')
      })

    // 刷新
    revalidatePath(path)
    return parseStringify(newFile)
  } catch (error) {
    handleError(error, '上传文件失败')
  }
}

// 创建 query
const createQueries = (
  currentUser: any,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email]),
    ]),
  ]

  if (types.length > 0) {
    queries.push(Query.equal('type', types))
  }
  if (searchText) {
    queries.push(Query.contains('name', searchText))
  }
  if (limit) {
    queries.push(Query.limit(limit))
  }

  if (sort) {
    const [sortBy, orderBy] = sort.split('-')

    queries.push(
      orderBy === 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    )
  }

  return queries
}

// 获取文件列表
export const getFiles = async ({
  types = [],
  searchText = '',
  sort = '$createdAt-desc',
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient()

  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      throw new Error('用户未登录')
    }

    const queries = createQueries(currentUser, types, searchText, sort, limit)

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    )

    return parseStringify(files)
  } catch (error) {
    handleError(error, '获取文件列表失败')
  }
}
