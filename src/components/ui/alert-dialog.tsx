import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay> & {
    variant?: 'default' | 'blur' | 'dark';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      // Base styles
      'fixed inset-0 z-50 transition-all duration-300',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      
      // Variant styles
      {
        'bg-black/80': variant === 'default',
        'bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60': variant === 'blur',
        'bg-black/90': variant === 'dark',
      },
      
      className
    )}
    {...props}
    ref={ref}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
    size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
    variant?: 'default' | 'destructive' | 'success' | 'warning';
    showCloseButton?: boolean;
  }
>(({ className, size = 'default', variant = 'default', showCloseButton = false, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay variant={variant === 'destructive' ? 'dark' : 'blur'} />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        // Base positioning and animation
        'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
        'duration-300 ease-out',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
        'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        
        // Base styling
        'grid gap-4 border bg-background shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        
        // Responsive sizing and spacing
        'w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-auto',
        'p-4 sm:p-6',
        'rounded-lg sm:rounded-xl',
        
        // Size variants - responsive widths
        {
          'sm:w-full sm:max-w-sm': size === 'sm',
          'sm:w-full sm:max-w-md lg:max-w-lg': size === 'default',
          'sm:w-full sm:max-w-lg lg:max-w-xl xl:max-w-2xl': size === 'lg',
          'sm:w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl': size === 'xl',
          'w-[calc(100vw-1rem)] h-[calc(100vh-1rem)] sm:w-[calc(100vw-2rem)] sm:h-[calc(100vh-2rem)] max-w-none': size === 'full',
        },
        
        // Variant styles
        {
          'border-border': variant === 'default',
          'border-destructive/20 bg-destructive/5': variant === 'destructive',
          'border-green-500/20 bg-green-50 dark:bg-green-950/20': variant === 'success',
          'border-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/20': variant === 'warning',
        },
        
        className
      )}
      {...props}
    >
      {/* Optional close button */}
      {showCloseButton && (
        <AlertDialogPrimitive.Cancel asChild>
          <button
            className={cn(
              'absolute right-3 top-3 sm:right-4 sm:top-4',
              'rounded-sm opacity-70 ring-offset-background transition-opacity',
              'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:pointer-events-none',
              'h-6 w-6 flex items-center justify-center',
              'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Close"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m11.7816 4.03157c.0824-.08434.0824-.22118 0-.30552-.0842-.08434-.2211-.08434-.3055 0L7.5 7.69685l-3.97631-3.97079c-.08434-.08434-.22118-.08434-.30552 0-.08434.08434-.08434.22118 0 .30552L7.19685 7.5 3.22606 11.4768c-.08434.0843-.08434.2212 0 .3055.08434.0843.22118.0843.30552 0L7.5 8.30315l3.9763 3.9708c.0843.0843.2212.0843.3055 0 .0843-.0843.0843-.2212 0-.3055L8.30315 7.5l3.97045-3.96843Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </AlertDialogPrimitive.Cancel>
      )}
      {children}
    </AlertDialogPrimitive.Content>
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'destructive' | 'success' | 'warning';
    centered?: boolean;
  }
>(({ className, variant = 'default', centered = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col gap-2',
      // Responsive text alignment
      {
        'text-center': centered,
        'text-center sm:text-left': !centered,
      },
      // Variant-specific styling
      {
        'text-foreground': variant === 'default',
        'text-destructive': variant === 'destructive',
        'text-green-700 dark:text-green-400': variant === 'success',
        'text-yellow-700 dark:text-yellow-400': variant === 'warning',
      },
      className
    )}
    {...props}
  />
));
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical' | 'responsive';
    justify?: 'start' | 'center' | 'end' | 'between';
  }
>(({ className, orientation = 'responsive', justify = 'end', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex gap-2',
      // Orientation styles
      {
        'flex-row': orientation === 'horizontal',
        'flex-col': orientation === 'vertical',
        'flex-col-reverse sm:flex-row': orientation === 'responsive',
      },
      // Justify styles
      {
        'justify-start sm:justify-start': justify === 'start',
        'justify-center sm:justify-center': justify === 'center',
        'justify-end sm:justify-end': justify === 'end',
        'justify-between sm:justify-between': justify === 'between',
      },
      // Responsive spacing
      'mt-4 sm:mt-6',
      className
    )}
    {...props}
  />
));
AlertDialogFooter.displayName = 'AlertDialogFooter';

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title> & {
    size?: 'sm' | 'default' | 'lg';
    variant?: 'default' | 'destructive' | 'success' | 'warning';
  }
>(({ className, size = 'default', variant = 'default', ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn(
      'font-semibold leading-none tracking-tight',
      // Responsive text sizing
      {
        'text-base sm:text-lg': size === 'sm',
        'text-lg sm:text-xl': size === 'default',
        'text-xl sm:text-2xl': size === 'lg',
      },
      // Variant colors
      {
        'text-foreground': variant === 'default',
        'text-destructive': variant === 'destructive',
        'text-green-700 dark:text-green-400': variant === 'success',
        'text-yellow-700 dark:text-yellow-400': variant === 'warning',
      },
      className
    )}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description> & {
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, size = 'default', ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn(
      'text-muted-foreground leading-relaxed',
      // Responsive text sizing
      {
        'text-xs sm:text-sm': size === 'sm',
        'text-sm sm:text-base': size === 'default',
        'text-base sm:text-lg': size === 'lg',
      },
      className
    )}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
    variant?: 'default' | 'destructive' | 'success' | 'warning';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    fullWidth?: boolean;
  }
>(({ className, variant = 'default', size = 'default', fullWidth = false, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      buttonVariants({ 
        variant: variant === 'success' ? 'default' : variant === 'warning' ? 'default' : variant, 
        size 
      }),
      // Responsive width
      {
        'w-full sm:w-auto': fullWidth,
      },
      // Custom variant colors
      {
        'bg-green-600 hover:bg-green-700 text-white': variant === 'success',
        'bg-yellow-600 hover:bg-yellow-700 text-white': variant === 'warning',
      },
      // Responsive ordering in footer
      'order-1 sm:order-2',
      className
    )}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & {
    size?: 'default' | 'sm' | 'lg' | 'icon';
    fullWidth?: boolean;
  }
>(({ className, size = 'default', fullWidth = false, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: 'outline', size }),
      // Responsive spacing and width
      'mt-2 sm:mt-0',
      {
        'w-full sm:w-auto': fullWidth,
      },
      // Responsive ordering in footer
      'order-2 sm:order-1',
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// Enhanced preset component for common use cases
const AlertDialogPreset = React.forwardRef<
  React.ElementRef<typeof AlertDialogContent>,
  Omit<React.ComponentPropsWithoutRef<typeof AlertDialogContent>, 'children'> & {
    type: 'confirm' | 'delete' | 'info' | 'warning' | 'success';
    title: string;
    description?: string;
    actionLabel?: string;
    cancelLabel?: string;
    onAction?: () => void;
    onCancel?: () => void;
    actionButtonProps?: React.ComponentPropsWithoutRef<typeof AlertDialogAction>;
    cancelButtonProps?: React.ComponentPropsWithoutRef<typeof AlertDialogCancel>;
  }
>(({ 
  type, 
  title, 
  description, 
  actionLabel, 
  cancelLabel = 'Cancel', 
  onAction,
  onCancel,
  actionButtonProps,
  cancelButtonProps,
  ...props 
}, ref) => {
  const config = {
    confirm: {
      variant: 'default' as const,
      actionVariant: 'default' as const,
      defaultActionLabel: 'Confirm',
    },
    delete: {
      variant: 'destructive' as const,
      actionVariant: 'destructive' as const,
      defaultActionLabel: 'Delete',
    },
    info: {
      variant: 'default' as const,
      actionVariant: 'default' as const,
      defaultActionLabel: 'OK',
    },
    warning: {
      variant: 'warning' as const,
      actionVariant: 'warning' as const,
      defaultActionLabel: 'Continue',
    },
    success: {
      variant: 'success' as const,
      actionVariant: 'success' as const,
      defaultActionLabel: 'OK',
    },
  };

  const currentConfig = config[type];

  return (
    <AlertDialogContent ref={ref} variant={currentConfig.variant} {...props}>
      <AlertDialogHeader variant={currentConfig.variant}>
        <AlertDialogTitle variant={currentConfig.variant}>
          {title}
        </AlertDialogTitle>
        {description && (
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        )}
      </AlertDialogHeader>
      <AlertDialogFooter>
        {type !== 'info' && type !== 'success' && (
          <AlertDialogCancel onClick={onCancel} {...cancelButtonProps}>
            {cancelLabel}
          </AlertDialogCancel>
        )}
        <AlertDialogAction 
          variant={currentConfig.actionVariant}
          onClick={onAction}
          {...actionButtonProps}
        >
          {actionLabel || currentConfig.defaultActionLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
});
AlertDialogPreset.displayName = 'AlertDialogPreset';

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogPreset,
};