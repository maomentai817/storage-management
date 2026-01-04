import React from 'react'

import FormattedDateTime from '@/components/FormattedDateTime'
import Thumbnail from '@/components/Thumbnail'
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
