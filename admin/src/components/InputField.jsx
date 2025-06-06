import { Eye } from 'lucide-react'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'

export const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  required,
  disabled,
  opcSelect = [],
  accept = '',
  loadOptions = () => {},
  classInput = 'md:col-span-1',
  document = false,
  autofocus = false,
  note = '',
  inputKey
}) => {
  return (
    <div className={`sm:col-span-6 ${classInput}`}>
      <div className='flex justify-between'>
        <label
          htmlFor={name}
          className='block text-sm font-medium text-gray-700'
        >
          {label}
        </label>
        {document && value && (
          <a
            href={value}
            target='_blank'
            className='text-sm text-gray-700 hover:opacity-80 cursor-pointer'
          >
            <Eye className='h-6' />
          </a>
        )}
      </div>
      <div className='mt-1'>
        {type === 'select' ? (
          <select
            key={opcSelect.map((o) => o.value).join('-')}
            name={name}
            id={name}
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100'
          >
            {opcSelect.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : type === 'async' ? (
          <>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadOptions}
              name={name}
              id={name}
              value={value}
              onChange={onChange}
              isDisabled={disabled}
              required={required}
              classNames={{
                control: () =>
                  'shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border disabled:bg-gray-100'
              }}
            />
            <p className='mt-1 text-gray-500 text-[12px] font-medium'>{note}</p>
          </>
        ) : type === 'async-multi' ? (
          <AsyncSelect
            key={inputKey}
            cacheOptions
            defaultOptions
            loadOptions={loadOptions}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            isDisabled={disabled}
            isMulti
            required={required}
            classNames={{
              control: () =>
                'shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border disabled:bg-gray-100'
            }}
          />
        ) : type === 'select-normal' ? (
          <Select
            options={opcSelect}
            isMulti
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            isDisabled={disabled}
            required={required}
            classNames={{
              control: () =>
                'shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border disabled:bg-gray-100'
            }}
          />
        ) : type === 'file' ? (
          <>
            <input
              accept={accept}
              type={type}
              name={name}
              id={name}
              onChange={onChange}
              disabled={disabled}
              required={required}
              className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100'
            />
          </>
        ) : type === 'checkbox' ? (
          <input
            type={type}
            name={name}
            autoFocus={autofocus}
            id={name}
            value={value || ''}
            checked={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-500 p-10 sm:text-sm border-gray-300 rounded-md border disabled:bg-gray-100'
          />
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            id={name}
            onChange={onChange}
            disabled={disabled}
            required={required}
            value={value || ''}
            rows={5}
            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100'
          />
        ) : (
          <input
            type={type}
            name={name}
            autoFocus={autofocus}
            id={name}
            value={value || ''}
            min={type === 'number' ? 0 : undefined}
            onChange={(e) => {
              if (type === 'number') {
                const v = parseFloat(e.target.value)
                if (v >= 0 || isNaN(v)) onChange(e)
              } else {
                onChange(e)
              }
            }}
            onKeyDown={
              type === 'number'
                ? (e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault()
                    }
                  }
                : undefined
            }
            disabled={disabled}
            onWheel={type === 'number' ? (e) => e.target.blur() : undefined}
            required={required}
            className='shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100'
          />
        )}
      </div>
    </div>
  )
}
