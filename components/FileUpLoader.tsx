'use client'

import React, { useCallback, useState } from 'react'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useDropzone } from 'react-dropzone'

import { Button } from '@/components/ui/button'
import { MAX_FILE_SIZE } from '@/constants'
import { useToast } from '@/hooks/use-toast'
import { uploadFile } from '@/lib/actions/file.actions'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'

import Thumbnail from './Thumbnail'

interface Props {
  ownerId: string
  accountId: string
  className?: string
}

const FileUpLoader = (props: Props) => {
  const { ownerId, accountId, className } = props
  const path = usePathname()
  const { toast } = useToast()

  // 文件信息
  const [files, setFiles] = useState<File[]>([])

  // 接收文件上传
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
      // 上传行为: 一个 Promise 数组
      const uploadPromises = acceptedFiles.map(async (file) => {
        // 文件超大 -> 移除并提示
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name))

          return toast({
            description: (
              <p className='body-2 text-white'>
                <span className='font-semibold'>{file.name}</span>{' '}
                超过最大文件大小限制. 最大文件大小为 50MB.
              </p>
            ),
            className: 'error-toast',
          })
        }

        return uploadFile({
          file,
          ownerId,
          accountId,
          path,
        }).then((uploadedFile) => {
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name)
            )
          }
        })
      })

      await Promise.all(uploadPromises)
    },
    [ownerId, accountId, path]
  )

  // 文件上传挂载
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  // 文件删除
  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation()
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))
  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn('uploader-button', className)}>
        <Image
          src='/assets/icons/upload.svg'
          alt='uploader'
          width={24}
          height={24}
        />
        <p>上传</p>
      </Button>
      {/* 上传文件预览 */}
      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>上传中...</h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name)

            return (
              <li
                key={`${file.name}-${index}`}
                className='uploader-preview-item'
              >
                <div className='flex items-center gap-3 flex-1'>
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className='preview-item-name flex-1'>
                    {file.name}
                    <Image
                      src='/assets/icons/file-loader.gif'
                      width={80}
                      height={26}
                      alt='loader'
                    />
                  </div>
                </div>

                <Image
                  src='/assets/icons/remove.svg'
                  width={24}
                  height={24}
                  alt='remove'
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default FileUpLoader
