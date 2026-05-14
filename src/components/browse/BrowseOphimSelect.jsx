import { useMemo } from 'react'
import Select from 'react-select'
import { browseOphimSelectStyles } from './browseOphimSelectStyles'

/**
 * Select OPhim (quốc gia / thể loại …) — react-select, có tìm kiếm trong menu.
 * @param {{ _id?: string, name: string, slug: string }[]} props.items
 */
export function BrowseOphimSelect({
  label,
  labelId,
  inputId,
  instanceId,
  items = [],
  valueSlug,
  onChange,
  disabled,
  placeholder,
  noOptionsMessage = 'Không thấy mục phù hợp',
}) {
  const options = useMemo(
    () => items.map((c) => ({ value: c.slug, label: c.name })),
    [items],
  )

  const value = useMemo(
    () => options.find((o) => o.value === valueSlug) ?? null,
    [options, valueSlug],
  )

  return (
    <div className="browse-country browse-country--react">
      <span className="browse-country__label" id={labelId}>
        {label}
      </span>
      <Select
        aria-labelledby={labelId}
        inputId={inputId}
        instanceId={instanceId}
        options={options}
        value={value}
        onChange={(opt) => onChange(opt?.value ?? '')}
        isDisabled={disabled}
        isClearable
        isSearchable
        placeholder={placeholder}
        noOptionsMessage={() => noOptionsMessage}
        loadingMessage={() => 'Đang tải…'}
        styles={browseOphimSelectStyles}
        menuShouldScrollIntoView={false}
        className="browse-country__react-select"
      />
    </div>
  )
}
