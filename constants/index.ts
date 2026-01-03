export const navItems = [
  {
    name: '仪表盘',
    icon: '/assets/icons/dashboard.svg',
    url: '/',
  },
  {
    name: '文档',
    icon: '/assets/icons/documents.svg',
    url: '/documents',
  },
  {
    name: '图片',
    icon: '/assets/icons/images.svg',
    url: '/images',
  },
  {
    name: '媒体',
    icon: '/assets/icons/video.svg',
    url: '/media',
  },
  {
    name: '其他',
    icon: '/assets/icons/others.svg',
    url: '/others',
  },
]

export const actionsDropdownItems = [
  {
    label: 'Rename',
    icon: '/assets/icons/edit.svg',
    value: 'rename',
  },
  {
    label: 'Details',
    icon: '/assets/icons/info.svg',
    value: 'details',
  },
  {
    label: 'Share',
    icon: '/assets/icons/share.svg',
    value: 'share',
  },
  {
    label: 'Download',
    icon: '/assets/icons/download.svg',
    value: 'download',
  },
  {
    label: 'Delete',
    icon: '/assets/icons/delete.svg',
    value: 'delete',
  },
]

export const sortTypes = [
  {
    label: 'Date created (newest)',
    value: '$createdAt-desc',
  },
  {
    label: 'Created Date (oldest)',
    value: '$createdAt-asc',
  },
  {
    label: 'Name (A-Z)',
    value: 'name-asc',
  },
  {
    label: 'Name (Z-A)',
    value: 'name-desc',
  },
  {
    label: 'Size (Highest)',
    value: 'size-desc',
  },
  {
    label: 'Size (Lowest)',
    value: 'size-asc',
  },
]

export const avatarPlaceholderUrl =
  'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const documentExtensions = [
  'pdf',
  'doc',
  'docx',
  'txt',
  'xls',
  'xlsx',
  'csv',
  'rtf',
  'ods',
  'ppt',
  'odp',
  'md',
  'html',
  'htm',
  'epub',
  'pages',
  'fig',
  'psd',
  'ai',
  'indd',
  'xd',
  'sketch',
  'afdesign',
  'afphoto',
  'afphoto',
]
export const imageExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'bmp',
  'svg',
  'webp',
]
export const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm']
export const audioExtensions = ['mp3', 'wav', 'ogg', 'flac']

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
