import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  // Base styles with enhanced responsiveness and UX
  'relative w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 ease-in-out ' +
  // Responsive padding and spacing
  'sm:px-4 sm:py-3 md:px-5 md:py-4 ' +
  // Enhanced focus and hover states
  'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ' +
  'hover:shadow-sm ' +
  // Better icon positioning for all screen sizes
  '[&>svg+div]:translate-y-[-2px] sm:[&>svg+div]:translate-y-[-3px] ' +
  '[&>svg]:absolute [&>svg]:left-3 [&>svg]:top-2.5 ' +
  'sm:[&>svg]:left-4 sm:[&>svg]:top-4 ' +
  '[&>svg]:text-foreground [&>svg]:flex-shrink-0 ' +
  // Responsive text spacing with icons
  '[&>svg~*]:pl-6 sm:[&>svg~*]:pl-7 md:[&>svg~*]:pl-8 ' +
  // Better text wrapping and overflow handling
  'break-words overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive:
          'border-destructive/50 text-destructive bg-destructive/5 ' +
          'dark:border-destructive dark:bg-destructive/10 ' +
          '[&>svg]:text-destructive',
        // Additional variants for better UX
        warning: 
          'border-yellow-500/50 text-yellow-800 bg-yellow-50 ' +
          'dark:border-yellow-500 dark:text-yellow-300 dark:bg-yellow-950/20 ' +
          '[&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
        success: 
          'border-green-500/50 text-green-800 bg-green-50 ' +
          'dark:border-green-500 dark:text-green-300 dark:bg-green-950/20 ' +
          '[&>svg]:text-green-600 dark:[&>svg]:text-green-400',
        info: 
          'border-blue-500/50 text-blue-800 bg-blue-50 ' +
          'dark:border-blue-500 dark:text-blue-300 dark:bg-blue-950/20 ' +
          '[&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',
      },
      size: {
        sm: 'text-xs px-2 py-1.5 sm:px-3 sm:py-2',
        default: '', // Uses base styles
        lg: 'text-base px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof alertVariants> & {
    dismissible?: boolean;
    onDismiss?: () => void;
  }
>(({ className, variant, size, dismissible, onDismiss, children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant, size }), className)}
    {...props}
  >
    {children}
    {dismissible && onDismiss && (
      <button
        onClick={onDismiss}
        className={cn(
          'absolute right-2 top-2 rounded-sm opacity-70 transition-opacity ' +
          'hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 ' +
          'focus:ring-ring focus:ring-offset-2 p-1',
          'sm:right-3 sm:top-3'
        )}
        aria-label="Dismiss alert"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3 sm:h-4 sm:w-4"
        >
          <path
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
    )}
  </div>
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      'mb-1 font-medium leading-tight tracking-tight ' +
      // Responsive font sizing
      'text-sm sm:text-base ' +
      // Better line height for readability
      'leading-5 sm:leading-6',
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Responsive text sizing and spacing
      'text-xs sm:text-sm leading-relaxed ' +
      // Better paragraph spacing
      '[&_p]:leading-relaxed [&_p:not(:last-child)]:mb-2 ' +
      // Enhanced readability
      '[&_p]:text-current opacity-90',
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
export type { VariantProps };
export { alertVariants };