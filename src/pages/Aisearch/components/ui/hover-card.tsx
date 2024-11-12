// "use client";

// import * as React from "react";
// import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

// import { cn } from "../../lib/utils";

// const HoverCard = React.forwardRef<
//   React.ElementRef<typeof HoverCardPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>
// >(({ ...props }, ref) => (
//   <HoverCardPrimitive.Root openDelay={200} closeDelay={100} {...props} />
// ));

// HoverCard.displayName = HoverCardPrimitive.Root.displayName;

// const HoverCardTrigger = HoverCardPrimitive.Trigger;

// const HoverCardContent = React.forwardRef<
//   React.ElementRef<typeof HoverCardPrimitive.Content>,
//   React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
// >(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
//   <HoverCardPrimitive.Content
//     ref={ref}
//     align={align}
//     sideOffset={sideOffset}
//     className={cn(
//       "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
//       className,
//     )}
//     {...props}
//   />
// ));

// HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

// export { HoverCard, HoverCardTrigger, HoverCardContent };
"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

const HoverCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMouseEnter = () => {
    setTimeout(() => setIsOpen(true), 200); // 延迟 200ms 打开
  };

  const handleMouseLeave = () => {
    setTimeout(() => setIsOpen(false), 100); // 延迟 100ms 关闭
  };

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
});

HoverCard.displayName = "HoverCard";

const HoverCardTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
));

HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useContext(HoverCardContext);

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        isOpen
          ? "animate-in fade-in-0 zoom-in-95"
          : "animate-out fade-out-0 zoom-out-95",
        align === "center" && "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      style={{ marginTop: isOpen ? sideOffset : 0 }}
      {...props}
    />
  );
});

HoverCardContent.displayName = "HoverCardContent";

const HoverCardContext = React.createContext(false);

export { HoverCard, HoverCardTrigger, HoverCardContent };
