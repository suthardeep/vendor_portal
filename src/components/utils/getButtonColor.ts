import type { ButtonProps, ButtonVariant } from "../base/Button";

type ButtonColor = NonNullable<ButtonProps["color"]>;
type ButtonVariantType = NonNullable<ButtonVariant>;

export function getColorClasses(
  variant: ButtonVariant = "filled",
  color: ButtonProps["color"] = "primary",
): string {
  const themes: Record<ButtonColor, Record<ButtonVariantType, string>> = {
    primary: {
      filled:
        "bg-pl-500 hover:bg-pl-600 active:bg-pl-500 text-white dark:bg-pd-500 dark:hover:bg-pd-600 dark:active:bg-pd-500",
      outline:
        "border border-pl-500 text-pl-600 hover:bg-pl-50 dark:border-pd-400 dark:text-pd-400 dark:hover:bg-pd-800",
      ghost: "text-pl-600 hover:bg-pl-50 dark:text-pd-300 dark:hover:bg-pd-800",
      link: "text-pl-600 hover:underline dark:text-pd-300",
      text: "text-pl-600 hover:text-pl-700 dark:text-pd-300 dark:hover:text-pd-200",
    },
    neutral: {
      filled:
        "bg-nl-100 hover:bg-nl-200 active:bg-nl-100 text-nl-700 dark:text-nd-50 dark:bg-nd-600 dark:hover:bg-nd-700 dark:active:bg-nd-600",
      outline:
        "border border-nl-700 text-nl-700 hover:bg-nl-50 active:bg-nl-100 dark:border-nd-200 dark:text-nd-100 dark:hover:bg-nd-700 dark:active:bg-nd-600",
      ghost:
        "text-nl-700 hover:bg-nl-50 active:bg-nl-100 dark:text-nd-200 dark:hover:bg-nd-700 dark:active:bg-nd-600",
      link: "text-nl-700 hover:underline dark:text-nd-200",
      text: "text-nl-700 hover:text-nl-800 dark:text-nd-200 dark:hover:text-nd-100",
    },
    success: {
      filled:
        "bg-sl-500 hover:bg-sl-600 active:bg-sl-500 text-white dark:bg-sd-500 dark:hover:bg-sd-600 active:dark:bg-sd-500",
      outline:
        "border border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 dark:border-sd-500 dark:text-ds-500 dark:hover:bg-green-900/20 dark:active:bg-green-900/40",
      ghost:
        "text-sl-600 hover:bg-green-100/60 active:bg-green-100 dark:text-sd-400 dark:hover:bg-green-900/20 dark:active:bg-green-900/40",
      link: "text-green-600 hover:underline dark:text-green-400",
      text: "text-sl-600 hover:text-sl-700 dark:text-sd-400 dark:hover:text-sd-300",
    },
    danger: {
      filled:
        "bg-dl-500 hover:bg-dl-600 active:bg-dl-500 text-white dark:bg-dd-500 dark:hover:bg-dd-600 active:dark:bg-dd-600",
      outline:
        "border border-dl-500 text-dl-500 hover:bg-red-50 active:bg-red-100 dark:border-dd-500 dark:text-dd-400 dark:hover:bg-red-900/20 dark:active:bg-red-900/40",
      ghost:
        "text-dl-500 hover:bg-red-50 active:bg-red-100 dark:text-dd-400 dark:hover:bg-red-900/30 dark:active:bg-red-900/60",
      link: "text-dl-500 hover:underline dark:text-dd-400",
      text: "text-dl-500 hover:text-dl-600 dark:text-dd-400 dark:hover:text-dd-300",
    },
  };

  return themes[color]?.[variant] ?? "";
}
