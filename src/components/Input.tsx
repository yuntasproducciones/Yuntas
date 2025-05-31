import React from "react";

interface Props {
  label?: string;
  type?: string;
  rows?: number;
  name: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  defaultValue?: string | number | string[];
}

const Input = ({
  label,
  type = "text",
  rows,
  name,
  value,
  placeholder,
  onChange,
  className,
  required = false,
  disabled = false,
  defaultValue,
}: Props) => {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="mb-1 font-semibold text-gray-700">
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          defaultValue={defaultValue}
          className={`px-4 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none  focus:ring-2 focus:ring-[#6886e9] focus:border-[#6886e9] transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          disabled={disabled}
          defaultValue={defaultValue}
          className={`px-4 py-2 text-black border border-gray-300 rounded-lg shadow-sm focus:outline-none  focus:ring-2 focus:ring-[#6886e9] focus:border-[#6886e9] transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        />
      )}
    </div>
  );
};

export default Input;
