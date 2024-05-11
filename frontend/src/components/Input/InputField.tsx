import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const InputField = (props: InputFieldProps) => {
  const { children, ...rest } = props;

  return (
    <div className="flex">
      <input
        {...rest}
        className="flex w-full bg-transparent rounded-md text-4xl focus-visible:outline-none"
      />
      {children}
    </div>
  );
};

export default InputField;
