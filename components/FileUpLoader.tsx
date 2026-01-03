'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { cn, convertFileToUrl, getFileType } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Thumbnail from './Thumbnail'

interface Props {
  ownerId: string
  accountId: string
  className?: string
}

const FileUpLoader = (props: Props) => {
  const { ownerId, accountId, className } = props
  const pathname = usePathname()

  // 文件信息
  const [files, setFiles] = useState<File[]>([])

  // 接收文件上传
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
    // 上传行为
  }, [])

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
          <h4 className='h4 text-light-100'>Uploading</h4>

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
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  )
}

export default FileUpLoader
