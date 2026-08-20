import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-[160ms] ease-out active:scale-[0.97] motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none select-none touch-manipulation focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-main text-base-light hover:bg-primary-hover active:bg-primary-hover focus:bg-primary-pressed disabled:bg-primary-300",
        pryOutline:
          "text-primary-main border-[2px] border-primary-main hover:border-primary-hover hover:bg-primary-50 hover:text-primary-hover active:border-primary-hover active:bg-primary-50 active:text-primary-hover focus:text-primary-pressed focus:bg-transparent focus:border-primary-pressed disabled:border-primary-300 disabled:text-primary-300",
        grey: "text-gray-500 border-[2px] border-gray-300 hover:text-gray-600 hover:bg-gray-25 active:text-gray-600 active:bg-gray-25 focus:text-gray-700 disabled:text-gray-300",
        secondary:
          "bg-secondary-main text-base-light hover:bg-secondary-600 active:bg-secondary-600 focus:bg-secondary-700 disabled:bg-secondary-300",
        error:
          "bg-error-main text-base-light hover:bg-error-hover active:bg-error-hover focus:bg-error-pressed disabled:bg-error-300",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline active:underline active:scale-100",
        sidebarItem:
          "hover:bg-primary-25 hover:text-primary-main active:bg-primary-25 active:text-primary-main text-primary-main focus:bg-primary-hover focus:text-primary-25",
      },
      size: {
        default: "h-9 px-4 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "h-12 px-6 [&_svg:not([class*='size-'])]:size-6 text-[16px] font-medium rounded-[12px] gap-2",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        sidebarItem:
          "h-12 justify-start w-full px-5 gap-2 rounded-[var(--radius)] [&_svg:not([class*='size-'])]:size-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
