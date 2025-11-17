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
        "bg-primary-500 hover:bg-primary-600 active:bg-primary-500 text-white dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-500",
      outline:
        "border border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-800",
      ghost: "text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-800",
      link: "text-primary-600 hover:underline dark:text-primary-300",
      text: "text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200",
    },
    neutral: {
      filled:
        "bg-neutral-content hover:bg-neutral-content active:bg-neutral-content text-base-3 dark:text-neutral-content dark:bg-base-3 dark:hover:bg-base-3 dark:active:bg-base-3",
      outline:
        "border border-base-3 text-base-3 hover:bg-neutral-content active:bg-neutral-content dark:border-neutral-content dark:text-neutral-content dark:hover:bg-base-3 dark:active:bg-base-3",
      ghost:
        "text-base-3 hover:bg-neutral-content active:bg-neutral-content dark:text-neutral-content dark:hover:bg-base-3 dark:active:bg-base-3",
      link: "text-base-3 hover:underline dark:text-neutral-content",
      text: "text-base-3 hover:text-neutral dark:text-neutral-content dark:hover:text-neutral-content",
    },
    success: {
      filled:
        "bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-500 text-white dark:bg-secondary-500 dark:hover:bg-secondary-600 active:dark:bg-secondary-500",
      outline:
        "border border-green-600 text-green-600 hover:bg-green-50 active:bg-green-100 dark:border-secondary-500 dark:text-ds-500 dark:hover:bg-green-900/20 dark:active:bg-green-900/40",
      ghost:
        "text-secondary-600 hover:bg-green-100/60 active:bg-green-100 dark:text-secondary-400 dark:hover:bg-green-900/20 dark:active:bg-green-900/40",
      link: "text-green-600 hover:underline dark:text-green-400",
      text: "text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300",
    },
    danger: {
      filled:
        "bg-base-3 hover:bg-base-3 active:bg-base-3 text-white dark:bg-neutral-500 dark:hover:bg-neutral-600 active:dark:bg-neutral-600",
      outline:
        "border border-base-3 text-base-3 hover:bg-red-50 active:bg-red-100 dark:border-neutral-500 dark:text-neutral-400 dark:hover:bg-red-900/20 dark:active:bg-red-900/40",
      ghost:
        "text-base-3 hover:bg-red-50 active:bg-red-100 dark:text-neutral-400 dark:hover:bg-red-900/30 dark:active:bg-red-900/60",
      link: "text-base-3 hover:underline dark:text-neutral-400",
      text: "text-base-3 hover:text-base-3 dark:text-neutral-400 dark:hover:text-neutral-300",
    },
  };

  return themes[color]?.[variant] ?? "";
}
