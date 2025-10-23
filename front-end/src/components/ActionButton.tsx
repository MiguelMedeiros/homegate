import React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ variant, children, className, ...props }, ref) => {
    const baseClasses = "h-24 w-full rounded-2xl text-2xl font-semibold transition-all hover:scale-[1.02] sm:h-28 sm:text-3xl";
    
    const variantClasses = {
      primary: "border-2 border-transparent bg-brand text-background shadow-lg shadow-brand/20 hover:bg-brand/90 hover:shadow-xl hover:shadow-brand/30 hover:border hover:border-brand/50",
      secondary: "border-2 border-border/50 bg-card/50 backdrop-blur-sm hover:border-brand/50 hover:bg-brand/5 hover:border"
    };

    return (
      <Button
        ref={ref}
        variant={variant === 'primary' ? 'default' : 'outline'}
        size="lg"
        className={cn(baseClasses, variantClasses[variant as keyof typeof variantClasses], className as string)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export { ActionButton };
