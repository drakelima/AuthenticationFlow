import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="floating-input">
        <input
          ref={ref}
          placeholder=" "
          className={cn(
            "w-full px-3 py-4 border border-gray-300 rounded-md focus:outline-none",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        <label className={error ? "text-red-500" : ""}>{label}</label>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
