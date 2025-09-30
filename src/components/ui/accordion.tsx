import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    variant?: 'default' | 'card' | 'minimal';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      // Base styles
      'group relative',
      // Variant styles
      {
        'border-b border-border/60 last:border-b-0': variant === 'default',
        'mb-3 rounded-lg border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow duration-200': variant === 'card',
        'border-b border-border/40 last:border-b-0 hover:bg-accent/20 transition-colors duration-200': variant === 'minimal',
      },
      // Responsive enhancements
      'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    size?: 'sm' | 'md' | 'lg';
    hideIcon?: boolean;
    iconPosition?: 'left' | 'right';
  }
>(({ className, children, size = 'md', hideIcon = false, iconPosition = 'right', ...props }, ref) => (
  <AccordionPrimitive.Header className="flex w-full">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base styles
        'group/trigger flex flex-1 items-center gap-2 font-medium transition-all duration-200',
        'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'text-left w-full min-w-0', // Ensure proper text alignment and prevent overflow
        
        // Size variants - responsive
        {
          'py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm': size === 'sm',
          'py-3 px-4 sm:py-4 sm:px-5 text-sm sm:text-base': size === 'md',
          'py-4 px-5 sm:py-5 sm:px-6 text-base sm:text-lg': size === 'lg',
        },
        
        // Icon positioning
        {
          'justify-between': iconPosition === 'right' && !hideIcon,
          'flex-row-reverse justify-between': iconPosition === 'left' && !hideIcon,
          'justify-start': hideIcon,
        },
        
        // State styles
        '[&[data-state=open]>svg]:rotate-180',
        '[&[data-state=open]]:text-accent-foreground',
        
        className
      )}
      {...props}
    >
      {/* Content wrapper for proper text handling */}
      <span className="flex-1 min-w-0 truncate sm:whitespace-normal">
        {children}
      </span>
      
      {/* Chevron icon */}
      {!hideIcon && (
        <ChevronDownIcon 
          className={cn(
            'shrink-0 text-muted-foreground transition-all duration-200',
            'group-hover/trigger:text-foreground',
            // Responsive icon sizes
            {
              'h-3 w-3 sm:h-4 sm:w-4': size === 'sm',
              'h-4 w-4 sm:h-5 sm:w-5': size === 'md',
              'h-5 w-5 sm:h-6 sm:w-6': size === 'lg',
            }
          )}
        />
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, children, size = 'md', ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-muted-foreground transition-all duration-200',
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      // Responsive text sizes
      {
        'text-xs sm:text-sm': size === 'sm',
        'text-sm sm:text-base': size === 'md',
        'text-base sm:text-lg': size === 'lg',
      }
    )}
    {...props}
  >
    <div className={cn(
      // Responsive padding
      {
        'pb-2 pt-0 px-3 sm:pb-3 sm:px-4': size === 'sm',
        'pb-3 pt-0 px-4 sm:pb-4 sm:px-5': size === 'md',
        'pb-4 pt-0 px-5 sm:pb-5 sm:px-6': size === 'lg',
      },
      // Content styling
      'leading-relaxed',
      className
    )}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// Enhanced compound component with preset configurations
const AccordionGroup = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
    variant?: 'default' | 'card' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
    items: Array<{
      value: string;
      trigger: React.ReactNode;
      content: React.ReactNode;
      disabled?: boolean;
    }>;
  }
>(({ className, variant = 'default', size = 'md', items, ...props }, ref) => (
  <Accordion
    ref={ref}
    className={cn(
      'w-full',
      // Responsive container spacing
      {
        'space-y-1': variant === 'default' || variant === 'minimal',
        'space-y-2 sm:space-y-3': variant === 'card',
      },
      className
    )}
    {...props}
  >
    {items.map((item) => (
      <AccordionItem key={item.value} value={item.value} variant={variant}>
        <AccordionTrigger size={size} disabled={item.disabled}>
          {item.trigger}
        </AccordionTrigger>
        <AccordionContent size={size}>
          {item.content}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
));
AccordionGroup.displayName = 'AccordionGroup';

export { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent,
  AccordionGroup 
};