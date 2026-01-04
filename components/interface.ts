interface ActionType {
  label: string
  icon: string
  value: string
}

interface ShareInputProps {
  file: any
  // setEmails
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>
  onRemove: (email: string) => void
}
