import React from "react";

interface InputWithLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const InputWithLabel: React.FC<InputWithLabelProps> = ({
  id,
  label,
  ...props
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="mt-1 w-full rounded-md bg-zinc-100 px-4 py-2 text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
        required
      />
    </div>
  );
};