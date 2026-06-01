interface FormFieldProps {
  label: string
  name: string
  type?: string
  required?: boolean
  defaultValue?: string
}

export default function FormField({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: FormFieldProps) {
  return (
    <div>
      <label className="block mb-1 font-medium">
        {label}
        <input
          type={type}
          name={name}
          required={required}
          defaultValue={defaultValue}
          className="mt-1 block w-full border rounded px-3 py-2"
        />
      </label>
    </div>
  )
}
