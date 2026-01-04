import React from 'react'

import { Models } from 'node-appwrite'

import Card from '@/components/Card'
import Sort from '@/components/Sort'
import { getFiles } from '@/lib/actions/file.actions'
import { calculateTotalSize, getFileTypesParams } from '@/lib/utils'

interface SegmentParams {
  type: string
}
interface SearchParamProps {
  params?: Promise<SegmentParams>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
const page = async (props: SearchParamProps) => {
  const { params, searchParams } = props

  const type = ((await params)?.type as string) || ''

  // 文件列表
  const types = getFileTypesParams(type) as FileType[]
  const files = await getFiles({ types })

  return (
    <div className='page-container'>
      <section className='w-full'>
        <h1 className='h1 capitalize'>{type}</h1>

        <div className='total-size-section'>
          <p className='body-1'>
            共 <span className='h5'>{files.total}</span> 个文件, 占用{' '}
            <span className='h5'>{calculateTotalSize(files)}</span>
          </p>

          <div className='sort-container'>
            <p className='body-1 hidden sm:block text-light-200'>Sort by:</p>

            <Sort />
          </div>
        </div>
      </section>

      {/* 文件列表 */}
      {files.total > 0 ? (
        <section className='file-list'>
          {files.documents.map((file: Models.Document) => (
            <Card file={file} key={file.$id} />
          ))}
        </section>
      ) : (
        <p className='empty-list'>暂无文件</p>
      )}
    </div>
  )
}

export default page
