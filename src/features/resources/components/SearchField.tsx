import { useEffect, useState, type ChangeEvent } from 'react'
import { Input } from '@/design-system'

interface SearchFieldProps {
  initialValue: string
  onSearch: (value: string) => void
}

export function SearchField({ initialValue, onSearch }: SearchFieldProps) {
  const [inputValue, setInputValue] = useState(initialValue)

  useEffect(() => {
    if (inputValue === initialValue) {
      return
    }

    const timeoutId = window.setTimeout(() => onSearch(inputValue), 300)
    return () => window.clearTimeout(timeoutId)
  }, [initialValue, inputValue, onSearch])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <Input
      label="Search"
      placeholder="Search by name"
      value={inputValue}
      onChange={handleChange}
    />
  )
}
