'use client'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { FileDetails, ShareInput } from '@/components/ActionModalContent'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { actionsDropdownItems } from '@/constants'
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from '@/lib/actions/file.actions'
import { constructDownloadUrl } from '@/lib/utils'

const ActionDropdown = ({ file }: { file: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>(null)
  const [name, setName] = useState(file.name.replace(`.${file.extension}`, ''))
  // action content 部分 confirm loading 状态
  const [isLoading, setIsLoading] = useState(false)
  // share 部分分享 email 输入框
  const [emails, setEmails] = useState<string[]>([])
  const path = usePathname()

  const closeAllModals = () => {
    setIsModalOpen(false)
    setIsDropdownOpen(false)
    setAction(null)
    setName(file.name.replace(`.${file.extension}`, ''))
    setEmails([])
  }

  const handleAction = async () => {
    if (!action) return
    setIsLoading(true)
    let success = false

    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path,
        }),
      share: () =>
        updateFileUsers({
          fileId: file.$id,
          emails,
          path,
        }),
      delete: () =>
        deleteFile({
          fileId: file.$id,
          bucketFileId: file.bucketFileId,
          path,
        }),
    }

    success = await actions[action.value as keyof typeof actions]()

    if (success) closeAllModals()
    setIsLoading(false)
  }

  // 分享模块 - 移除分享人
  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email)

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    })

    if (success) setEmails(updatedEmails)
    closeAllModals()
  }

  // 模态框渲染
  const renderDialogContent = () => {
    const { value, label } = action!

    return (
      <DialogContent className='shad-dialog button'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>
            {label}
          </DialogTitle>
          {value === 'rename' && (
            <>
              <p className='subtitle-2'>暂不支持修改文件拓展名</p>
              <Input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}
          {value === 'details' && <FileDetails file={file} />}
          {value === 'share' && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === 'delete' && (
            <p className='delete-confirmation'>
              您确定要删除
              <span className='delete-file-name mx-1'>{file.name}</span>?
            </p>
          )}
        </DialogHeader>
        {/* 确认按钮 */}
        {['rename', 'share', 'delete'].includes(value) && (
          <DialogFooter className='flex flex-col gap-3 md:flex-row'>
            <Button onClick={closeAllModals} className='modal-cancel-button'>
              取消
            </Button>
            <Button onClick={handleAction} className='modal-submit-button'>
              <p className='capitalize'>{label}</p>
              {isLoading && (
                <Image
                  src='/assets/icons/loader.svg'
                  alt='loader'
                  width={24}
                  height={24}
                  className='animate-spin'
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className='shad-no-focus'>
          <Image
            src='/assets/icons/dots.svg'
            alt='dots'
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className='shad-dropdown-item'
              onClick={() => {
                setAction(actionItem)

                // 下载单独处理
                if (
                  ['rename', 'share', 'delete', 'details'].includes(
                    actionItem.value
                  )
                ) {
                  setIsModalOpen(true)
                }
              }}
            >
              {actionItem.value === 'download' ? (
                // 下载 action, 单独封装链接
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className='flex items-center gap-2'
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.value}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className='flex items-center gap-2'>
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.value}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {action && renderDialogContent()}
    </Dialog>
  )
}

export default ActionDropdown
