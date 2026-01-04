import React from 'react'

import Image from 'next/image'

import FormattedDateTime from '@/components/FormattedDateTime'
import Thumbnail from '@/components/Thumbnail'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { convertFileSize, formatDateTime } from '@/lib/utils'

const ImageThumbnail = ({ file }: { file: any }) => {
  return (
    <div className='file-details-thumbnail'>
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
      <div className='flex flex-col'>
        <p className='subtitle-2 mb-1'>{file.name}</p>
        <FormattedDateTime date={file.$createdAt} className='caption' />
      </div>
    </div>
  )
}

const DetailRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className='flex'>
      <p className='file-details-label text-left'>{label}</p>
      <p className='file-details-value text-left'>{value}</p>
    </div>
  )
}

export const FileDetails = ({ file }: { file: any }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className='space-y-4 px-2 pt-2'>
        <DetailRow label='类型:' value={file.extension} />
        <DetailRow label='大小:' value={convertFileSize(file.size)} />
        <DetailRow label='修改日期:' value={formatDateTime(file.$updatedAt)} />
        <DetailRow label='访问日期:' value={formatDateTime(`${new Date()}`)} />
      </div>
    </>
  )
}

export const ShareInput = ({
  file,
  onInputChange,
  onRemove,
}: ShareInputProps) => {
  return (
    <>
      <ImageThumbnail file={file} />

      <div className='share-wrapper'>
        <p className='subtitle-2 pl-1 text-light-100'>分享文件</p>
        <Input
          type='email'
          placeholder='输入邮箱'
          onChange={(e) => onInputChange(e.target.value.trim().split(','))}
          className='share-input-field'
        />

        <div className='pt-4'>
          <div className='flex justify-between'>
            <div className='subtitle-2 text-light-100'>分享与</div>
            <div className='subtitle-2 text-light-200'>
              {file.users.length} 人
            </div>
          </div>

          <div className='pt-2'>
            {file.users.map((email: string) => (
              <li
                key={email}
                className='flex items-center justify-between gap-2'
              >
                <p className='subtitle-2'>{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className='share-remove-user'
                >
                  <Image
                    src='/assets/icons/remove.svg'
                    alt='remove'
                    width={24}
                    height={24}
                    className='remove-icon'
                  />
                </Button>
              </li>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
