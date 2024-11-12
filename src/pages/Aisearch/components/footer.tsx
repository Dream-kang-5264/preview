// import Link from "next/link";
import { Button } from "./ui/button";
import { SiX, SiGithub, SiDiscord } from "react-icons/si";

export function Footer() {
  return (
    <footer className="w-full flex fixed bottom-0 right-0 p-1 z-50 bg-background/95">
      <div className="px-1 w-full flex flex-row justify-end space-x-1">
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <a href="https://discord.gg/kKmmqmjx" target="_blank" rel="noreferrer">
            <SiDiscord size={16} />
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <a href="https://git.new/farfalle" target="_blank" rel="noreferrer">
            <SiGithub size={16} />
          </a>
        </Button>
        <a
          href="https://x.com/rashadphz/status/1791098430565073383"
          target="_blank" rel="noreferrer"
        >
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <SiX size={16} />
          </Button>
        </a>
      </div>
    </footer>
  );
}
