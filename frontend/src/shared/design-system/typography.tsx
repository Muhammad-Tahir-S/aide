import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "../utils/cn";

type TextSize =
  | "display-2xl"
  | "display-xl"
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "display-xs"
  | "text-6xl"
  | "text-xl"
  | "text-lg"
  | "text-md"
  | "text-sm"
  | "text-xs";

type FontWeight = "regular" | "medium" | "semibold" | "bold";

type Variant = `${TextSize}/${FontWeight}`;

type CustomProps = {
  variant?: Variant;
  color?: string;
  truncate?: boolean;
};

interface ParagraphProps
  extends React.DetailedHTMLProps<
      HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >,
    CustomProps {}

const Typography = forwardRef<HTMLParagraphElement, ParagraphProps>(
  (
    { className, children, variant = "display-xl/regular", truncate, ...rest },
    ref,
  ) => {
    const [size, weight] = variant.split("/") as [TextSize, FontWeight];
    return (
      <p
        ref={ref}
        className={cn(
          textSizeStyleMap[size],
          fontWeightStyleMap[weight],
          "text-gray-700",

          {
            "overflow-hidden text-ellipsis max-w-full whitespace-nowrap ":
              truncate,
          },
          className,
        )}
        {...rest}
      >
        {children}
      </p>
    );
  },
);
Typography.displayName = "Typography";

export default Typography;

const textSizeStyleMap: { [k in TextSize]: string } = {
  "display-2xl": "text-[72px] leading-[90px] font-[400]",
  "display-xl": "text-[60px] leading-[72px]",
  "display-lg": "text-[48px] leading-[60px]",
  "display-md": "text-[36px] leading-[44px] ",
  "display-sm": "text-[30px] leading-[38px]",
  "display-xs": "text-[24px] leading-[32px]",
  "text-6xl": "text-[60px] leading-[4.625rem]",
  "text-xl": "text-[20px] leading-[30px]",
  "text-lg": "text-[18px] leading-[28px] ",
  "text-md": "text-[16px] leading-[24px] ",
  "text-sm": "text-[14px] leading-[20px]",
  "text-xs": "text-[12px] leading-[18px]",
};

const fontWeightStyleMap: { [k in FontWeight]: string } = {
  regular: "font-[400]",
  medium: "font-[500]",
  semibold: "font-[600]",
  bold: "font-[700]",
};
