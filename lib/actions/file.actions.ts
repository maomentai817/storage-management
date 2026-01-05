'use server'

import { revalidatePath } from 'next/cache'
import { ID, Query } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'

import { getCurrentUser } from '@/lib/actions/user.actions'
import { createAdminClient, createSessionClient } from '@/lib/appwrite'
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

// 重命名文件
export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient()

  try {
    const newName = `${name}.${extension}`
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        name: newName,
      }
    )

    // 刷新
    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (error) {
    handleError(error, '重命名文件失败')
  }
}

// 更新文件用户
export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: UpdateFileUsersProps) => {
  const { databases } = await createAdminClient()

  try {
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {
        users: emails,
      }
    )

    // 刷新
    revalidatePath(path)
    return parseStringify(updatedFile)
  } catch (error) {
    handleError(error, '更新文件用户失败')
  }
}

// 删除文件
export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { storage, databases } = await createAdminClient()

  try {
    const deleteFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    )

    if (deleteFile) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId)
    }

    // 刷新
    revalidatePath(path)
    return parseStringify({ status: 'success' })
  } catch (error) {
    handleError(error, '删除文件失败')
  }
}

// 获取总空间使用量
export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient()
    const currentUser = await getCurrentUser()
    if (!currentUser) throw new Error('User is not authenticated.')

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal('owner', [currentUser.$id])]
    )

    const totalSpace = {
      image: { size: 0, latestDate: '' },
      document: { size: 0, latestDate: '' },
      video: { size: 0, latestDate: '' },
      audio: { size: 0, latestDate: '' },
      other: { size: 0, latestDate: '' },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
    }

    files.documents.forEach((file: any) => {
      const fileType = file.type as FileType
      totalSpace[fileType].size += file.size
      totalSpace.used += file.size

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt
      }
    })

    return parseStringify(totalSpace)
  } catch (error) {
    handleError(error, 'Error calculating total space used:, ')
  }
}
