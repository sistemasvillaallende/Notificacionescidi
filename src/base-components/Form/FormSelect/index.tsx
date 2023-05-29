import React, { useContext } from "react";
import { formInlineContext } from "../FormInline";
import { twMerge } from "tailwind-merge";

interface FormSelectProps extends React.ComponentPropsWithoutRef<"select"> {
  formSelectSize?: "sm" | "lg";
}

const FormSelect = React.forwardRef((props: FormSelectProps,ref:any) => {
  const formInline = useContext(formInlineContext);
  const { formSelectSize, ...computedProps } = props;
  return (
    <select
      {...computedProps}
      ref={ref}
      className={twMerge([
        "disabled:bg-slate-100 disabled:cursor-not-allowed",
        "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]",
        "transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40", 
        props.formSelectSize == "sm" && "text-xs py-1.5 pl-2 pr-8",
        props.formSelectSize == "lg" && "text-lg py-1.5 pl-4 pr-8",
        formInline && "flex-1",
        props.className,
      ])}
    >
      {props.children}
    </select>
  );
})

export default FormSelect;
