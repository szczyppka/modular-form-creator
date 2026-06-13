import type { SelectOption } from '@/design-system'

function formatOptionLabel(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

interface BuildSelectOptionsConfig {
  placeholder?: string
  getLabel?: (value: string) => string
}

export function buildSelectOptions(
  values: readonly string[],
  { placeholder, getLabel = formatOptionLabel }: BuildSelectOptionsConfig = {},
): SelectOption[] {
  const options = values.map((value) => ({ value, label: getLabel(value) }))

  return placeholder === undefined
    ? options
    : [{ value: '', label: placeholder }, ...options]
}
