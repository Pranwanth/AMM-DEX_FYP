import React from "react";

interface InputFieldLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const InputFieldLabel = (props: InputFieldLabelProps) => {
  const { children } = props;

  return (
    <div className="text-xl text-sky-950 h-32 p-4 bg-white rounded-md my-2">
      {children}
    </div>
  );
};

export default InputFieldLabel;
