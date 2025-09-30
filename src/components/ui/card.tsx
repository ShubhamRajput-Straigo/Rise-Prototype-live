import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles (unchanged)
      'rounded-xl border bg-card text-card-foreground shadow',
      // Enhanced responsive styles
      'w-full max-w-full', // Ensure full width but respect container constraints
      'overflow-hidden', // Prevent content from breaking layout
      // Responsive border radius
      'rounded-lg sm:rounded-xl',
      // Enhanced shadow with hover effect
      'shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out',
      // Responsive spacing and sizing
      'min-h-0', // Allow shrinking
      // Touch-friendly interactions
      'touch-manipulation',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles (unchanged)
      'flex flex-col space-y-1.5',
      // Responsive padding
      'p-4 sm:p-5 lg:p-6',
      // Better text wrapping
      'break-words',
      // Flexible layout
      'flex-shrink-0', // Prevent header from shrinking too much
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Base styles (unchanged)
      'font-semibold leading-none tracking-tight',
      // Responsive typography
      'text-lg sm:text-xl lg:text-2xl',
      // Better text handling
      'break-words hyphens-auto',
      'line-clamp-3', // Limit to 3 lines on small screens
      // Improved line height for readability
      'leading-tight sm:leading-none',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      // Base styles (unchanged)
      'text-sm text-muted-foreground',
      // Responsive typography
      'text-xs sm:text-sm lg:text-base',
      // Better text handling
      'break-words hyphens-auto',
      // Improved line height and spacing
      'leading-relaxed',
      // Limit lines on very small screens
      'line-clamp-4 sm:line-clamp-none',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      // Responsive padding
      'px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6',
      // No top padding (unchanged behavior)
      'pt-0',
      // Better content handling
      'overflow-hidden', // Prevent content overflow
      'break-words', // Handle long words
      // Flexible layout
      'flex-1', // Take remaining space
      'min-h-0', // Allow shrinking
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles (unchanged)
      'flex items-center',
      // Responsive padding
      'px-4 pb-4 sm:px-5 sm:pb-5 lg:px-6 lg:pb-6',
      // No top padding (unchanged behavior)
      'pt-0',
      // Enhanced responsive layout
      'flex-wrap gap-2 sm:gap-3', // Allow wrapping on small screens
      'justify-between sm:justify-start', // Better alignment on different screens
      // Flexible layout
      'flex-shrink-0', // Prevent footer from shrinking
      // Better spacing for touch interfaces
      'min-h-[2.5rem] sm:min-h-[3rem]', // Ensure minimum touch target size
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};