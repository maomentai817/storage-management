'use client'

import React, { useEffect, useState } from 'react'

import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Models } from 'node-appwrite'
import { useDebounce } from 'use-debounce'

import FormattedDateTime from '@/components/FormattedDateTime'
import Thumbnail from '@/components/Thumbnail'
import { Input } from '@/components/ui/input'
import { getFiles } from '@/lib/actions/file.actions'

const Search = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Models.Document[]>([])
  const [open, setOpen] = useState(false)
  // 全局搜索
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query') || ''

  const router = useRouter()
  const path = usePathname()
  const [debounceQuery] = useDebounce(query, 300)

  useEffect(() => {
    const fetchFiles = async () => {
      if (debounceQuery.length === 0) {
        setOpen(false)
        setResults([])
        return router.push(path.replace(searchParams.toString(), ''))
      }
      // global search
      const files = await getFiles({ types: [], searchText: debounceQuery })
      setResults(files.documents)
      setOpen(true)
    }

    fetchFiles()
  }, [debounceQuery])

  // 初始化
  useEffect(() => {
    if (!searchQuery) {
      setQuery('')
    }
  }, [searchQuery])

  // 点击跳转
  const hangleClickItem = (file: any) => {
    setResults([])
    setOpen(false)

    router.push(
      `/${file.type === 'video' || file.type === 'audio' ? 'media' : file.type + 's'}?query=${query}`
    )
  }

  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image
          src='/assets/icons/search.svg'
          alt='search'
          width={24}
          height={24}
        />

        <Input
          placeholder='搜索...'
          className='search-input'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* 搜索结果模态框 */}
        {open && (
          <ul className='search-result'>
            {results.length > 0 ? (
              results.map((file: any) => (
                <li
                  className='flex items-center justify-between'
                  key={file.$id}
                  onClick={() => hangleClickItem(file)}
                >
                  <div className='flex cursor-pointer items-center gap-4'>
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className='size-9 min-w-9'
                    />

                    <p className='subtitle-2 line-clamp-1 text-light-100'>
                      {file.name}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.$createdAt}
                    className='caption line-clamp-1 text-light-200'
                  />
                </li>
              ))
            ) : (
              <p className='empty-result'>暂无搜索结果</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Search
