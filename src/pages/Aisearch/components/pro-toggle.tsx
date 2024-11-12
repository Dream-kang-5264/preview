



import { cn } from "../lib/utils";
import { useConfigStore } from "../stores";
import { Switch } from "./ui/switch";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";
import { Separator } from "./ui/separator";
// import { env } from "../env.mjs";


const ProToggle = () => {
  const { proMode, toggleProMode } = useConfigStore();

  return (
    <HoverCard>
     
      <HoverCardTrigger
        asChild
        className={cn(
          "hover:cursor-pointer",
          // !env.NEXT_PUBLIC_LOCAL_MODE_ENABLED && "hover:cursor-not-allowed",
        )}
      >
        <div className="group flex space-x-2 items-center justify-end  hover:text-primary">
          <Switch
            // disabled={!env.NEXT_PUBLIC_PRO_MODE_ENABLED}
            checked={proMode}
            onCheckedChange={toggleProMode}
          />
          <span
           style={{ width: "60px" }} 
            className={cn(
              
              "font-medium text-sm transition-all ",
              proMode ? "text-tint " : "text-gray-500 group-hover:text-primary",
            )}
          >
            专业模式
          </span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-3">
        <div className="flex flex-col items-start rounded-md ">
          <div className="text-lg font-medium ">
            <span className="text-tint">专业模式 </span>
            {/* <span>Mode</span> */}
          </div>
          <div className="text-sm gap-y-1 flex flex-col ">
            <div>
            专业模式将创建一个计划来回答你的问题，使答案更准确。
            </div>
          </div>
          <Separator className="mt-1" />
          <div className="text-xs text-muted-foreground mt-2">
            <span>需要手动设置 </span>
            <a
              className="text-primary hover:underline"
              href="https://github.com/rashadphz/farfalle/"
              target="_blank"
              rel="noreferrer"
            >
              了解更多
            </a>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ProToggle;
