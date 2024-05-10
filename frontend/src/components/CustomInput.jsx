// CustomInput.tsx
import React from 'react'
 
const CustomInput= ({
  label,
  type = 'text',
  value,
  onChange,
}) => {
  return (
<StyledInput
      variant='outlined'
      margin='normal'
      required
      fullWidth
      label={label}
      autoComplete={type === 'password' ? 'current-password' : 'on'}
      type={type}
      value={value}
      onChange={onChange}
    />
  )
}
 
export default CustomInput