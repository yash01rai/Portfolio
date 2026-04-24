import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'solid', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 group",
          "px-7 py-3.5",
          variant === 'solid' && "bg-text-primary text-bg hover:bg-bg hover:text-text-primary",
          variant === 'outline' && "border-2 border-stroke bg-bg text-text-primary hover:border-transparent",
          className
        )}
        {...props}
      >
        {/* Animated Gradient Border Overlay */}
        {(variant === 'solid' || variant === 'outline') && (
          <span className="absolute inset-0 rounded-full accent-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10 animate-gradient-shift"></span>
        )}
        
        {/* Inner Content Wrapper for Solid variant to hide the gradient behind */}
        {variant === 'solid' ? (
           <span className="relative z-10 bg-text-primary group-hover:bg-bg rounded-full px-7 py-3.5 flex items-center justify-center w-full h-full inset-0 absolute transition-colors duration-300">
             {children}
           </span>
        ) : variant === 'outline' ? (
           <span className="relative z-10 bg-bg rounded-full px-7 py-3.5 flex items-center justify-center w-full h-full inset-0 absolute transition-colors duration-300">
             {children}
           </span>
        ) : (
          children
        )}
        <span className="opacity-0 w-0 h-0">{children}</span> {/* Placeholder for sizing */}
      </button>
    );
  }
);

Button.displayName = "Button";
