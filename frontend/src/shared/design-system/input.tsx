import type { ReactNode } from "react";
import * as React from "react";

import CheckCircle from "@/shared/assets/icons/check-circle.svg?react";
import RemoveCircle from "@/shared/assets/icons/remove-circle.svg?react";
import { cn } from "@/shared/utils/cn";

import Typography from "./typography";

interface InputProps extends React.ComponentProps<"input"> {
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  label?: string;
  helperText?: string;
}

function Input({
  className,
  type = "text",
  label,
  rightIcon,
  leftIcon,
  helperText,
  ...props
}: InputProps) {
  const isInvalid = props["aria-invalid"] === true;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-2">
        {label ? (
          <Typography variant="text-sm/medium">{label}</Typography>
        ) : null}
        <div className="flex items-center relative">
          <input
            type={type}
            data-slot="input"
            className={cn(
              "peer",
              "file:text-foreground placeholder:text-gray-400 flex h-13 w-full min-w-0 rounded-md bg-gray-100 px-3 py-1 text-base-dark shadow-xs transition-[color,box-shadow] outline-none font-medium file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 md:text-sm",
              "focus:border-primary-400 focus:bg-transparent focus:border-[2px]",
              "aria-invalid:border-error-main aria-invalid:text-error-main",
              "[&:not(:focus):not(:placeholder-shown)]:bg-primary-25",
              className,
              leftIcon ? "pr-12" : "",
              rightIcon ? "pl-12" : "",
            )}
            {...props}
          />
          <div
            className={cn(
              "absolute items-center left-4 text-gray-400 h-[24px] w-[24px] peer-focus:text-primary-main",
              !isInvalid &&
                "peer-[&:not(:focus):not(:placeholder-shown)]:text-gray-500",
            )}
          >
            {rightIcon}
          </div>
          <div className="absolute items-center right-4 text-gray-400 h-[20px] w-[20px]">
            {leftIcon}
          </div>
        </div>
      </div>
      {helperText ? (
        <div className="flex gap-0.5">
          {isInvalid ? (
            <RemoveCircle className="fill-error-main w-4 h-4" />
          ) : (
            <CheckCircle className="fill-gray-400 w-4 h-4" />
          )}
          <Typography variant="text-sm/medium" className="text-gray-500">
            {helperText}
          </Typography>
        </div>
      ) : null}
    </div>
  );
}

export { Input };
