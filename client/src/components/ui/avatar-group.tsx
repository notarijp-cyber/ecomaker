import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{
    image?: string;
    name?: string;
    fallback: string;
  }>;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function AvatarGroup({
  items,
  max = 3,
  size = "md",
  className,
  ...props
}: AvatarGroupProps) {
  const visibleItems = items.slice(0, max);
  const extraItems = items.length - max;

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-6 w-6 text-xs";
      case "lg":
        return "h-10 w-10 text-base";
      case "md":
      default:
        return "h-8 w-8 text-sm";
    }
  };

  return (
    <div className={cn("flex items-center -space-x-2", className)} {...props}>
      {visibleItems.map((item, i) => (
        <Avatar
          key={i}
          className={cn(
            getSizeClass(),
            "border-2 border-white rounded-full"
          )}
        >
          {item.image && <AvatarImage src={item.image} alt={item.name || ""} />}
          <AvatarFallback className="bg-neutral-light text-neutral-dark">
            {item.fallback}
          </AvatarFallback>
        </Avatar>
      ))}
      
      {extraItems > 0 && (
        <Avatar
          className={cn(
            getSizeClass(),
            "border-2 border-white rounded-full bg-neutral-dark text-white"
          )}
        >
          <AvatarFallback>+{extraItems}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
