interface UploadFileProps {
  file: File
  ownerId: string
  accountId: string
  path: string
}

interface GetFilesProps {
  types: FileType[]
  searchText?: string
  sort?: string
  limit?: number
}

interface RenameFileProps {
  fileId: string
  name: string
  extension: string
  path: string
}

interface UpdateFileUsersProps {
  fileId: string
  emails: string[]
  path: string
}

interface DeleteFileProps {
  fileId: string
  bucketFileId: string
  path: string
}

interface FileUploaderProps {
  ownerId: string
  accountId: string
  className?: string
}
