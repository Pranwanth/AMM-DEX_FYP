import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputField = (props: InputFieldProps) => {
  const { children, ...rest } = props;

  return (
    <div className="flex text-xl h-32 p-4 bg-white rounded-md my-2 text-sky-950">
      <input
        {...rest}
        className="flex w-full bg-transparent rounded-md text-4xl focus-visible:outline-none"
      />
      {children}
    </div>
  );
};

export default InputField;
