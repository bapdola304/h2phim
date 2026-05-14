/** Style react-select (theme tối OPhim / H2Phim) — dùng chung Browse */
export const browseOphimSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 44,
    cursor: 'pointer',
    backgroundColor: 'rgba(7, 8, 13, 0.92)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: state.isFocused ? 'rgba(225, 29, 72, 0.55)' : 'rgba(255, 255, 255, 0.1)',
    boxShadow: state.isFocused ? '0 0 0 1px rgba(225, 29, 72, 0.55)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? 'rgba(225, 29, 72, 0.55)' : 'rgba(255,255,255,0.18)',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '2px 10px',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#f4f4f5',
    fontSize: '0.92rem',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#a1a1aa',
    fontSize: '0.9rem',
  }),
  input: (base) => ({
    ...base,
    color: '#f4f4f5',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: '#a1a1aa',
    padding: '0 10px',
    transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : undefined,
    transition: 'transform 0.2s ease',
    '&:hover': { color: '#f4f4f5' },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: '#a1a1aa',
    padding: '0 6px',
    '&:hover': { color: '#f4f4f5' },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'rgba(14, 16, 24, 0.98)',
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
    overflow: 'hidden',
    zIndex: 200,
  }),
  menuList: (base) => ({
    ...base,
    padding: 4,
    maxHeight: 280,
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: 8,
    margin: '2px 0',
    padding: '10px 12px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    color: '#f4f4f5',
    backgroundColor: state.isSelected
      ? 'rgba(225, 29, 72, 0.22)'
      : state.isFocused
        ? 'rgba(255,255,255,0.06)'
        : 'transparent',
    '&:active': { backgroundColor: 'rgba(225, 29, 72, 0.22)' },
  }),
  loadingMessage: (base) => ({ ...base, color: '#a1a1aa' }),
  noOptionsMessage: (base) => ({ ...base, color: '#a1a1aa' }),
}
