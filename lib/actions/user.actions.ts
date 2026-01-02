'use server'

import { createAdminClient } from '@/lib/appwrite'
import { appwriteConfig } from '@/lib/appwrite/config'
import { ID, Query } from 'node-appwrite'
import { handleError, parseStringify } from '@/lib/utils'
import { cookies } from 'next/headers'

// 创建账户流程

// 通过邮箱获取用户
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient()

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal('email', [email])]
  )

  return result.total > 0 ? result.documents[0] : null
}

// 发送 OPT 验证码
export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient()

  try {
    const session = await account.createEmailToken(ID.unique(), email)

    return session.userId
  } catch (error) {
    handleError(error, 'Failed to send email OTP')
  }
}

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string
  email: string
}) => {
  // 校验用户邮箱是否存在
  const existingUser = await getUserByEmail(email)

  // 发送 OPT 验证码
  const accountId = await sendEmailOTP({ email })
  if (!accountId) {
    throw new Error('Failed to send email OTP')
  }

  if (!existingUser) {
    const { databases } = await createAdminClient()

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: '',
        accountId,
      }
    )
  }

  return parseStringify({ accountId })
}

// 验证 OPT 验证码
export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string
  password: string
}) => {
  try {
    const { account } = await createAdminClient()

    const session = await account.createSession(accountId, password)
    ;(await cookies()).set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    return parseStringify({ sessionId: session.$id })
  } catch (error) {
    handleError(error, 'Failed to verify secret')
  }
}
