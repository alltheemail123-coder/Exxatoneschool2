import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "./utils";
import { Input } from "./input";

interface OutlineSearchInputProps extends React.ComponentProps<typeof Input> {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  iconClassName?: string;
  containerClassName?: string;
}

/**
 * Standardized Outline Search Input Component
 * 
 * Features:
 * - Consistent outline variant styling across the app
 * - Built-in search icon positioning
 * - Theme-aware colors using CSS custom properties
 * - Proper focus and hover states
 * - Accessible design with proper ARIA labels
 */
export function OutlineSearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className,
  iconClassName,
  containerClassName,
  ...props
}: OutlineSearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search 
        className={cn(
          "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none",
          iconClassName
        )} 
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          // Base outline styling - consistent across app
          "pl-9 w-64",
          // Uses border-control for AA-compliant consistent control borders
          "border-[var(--border-control)] bg-background text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2",
          "hover:border-ring",
          "transition-colors duration-200",
          className
        )}
        {...props}
      />
    </div>
  );
}

// Export for convenience
export { OutlineSearchInput as SearchInput };