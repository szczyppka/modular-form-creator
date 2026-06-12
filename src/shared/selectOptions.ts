import type { SelectOption } from '@/design-system'

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

/** Builds Select options from an enum value list, with a leading placeholder. */
export function buildSelectOptions(
  values: readonly string[],
  placeholder: string,
): SelectOption[] {
  return [
    { value: '', label: placeholder },
    ...values.map((value) => ({ value, label: capitalize(value) })),
  ]
}
