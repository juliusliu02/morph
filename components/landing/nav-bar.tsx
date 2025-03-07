import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const NavBar = () => {
  return (
    <header className="absolute top-5 flex w-full items-center justify-between px-5 sm:px-20">
      <div className="flex gap-2 items-baseline">
        <span className="text-2xl font-extrabold dark:text-slate-100">
          Morph
        </span>
        <span className="hidden sm:inline text-slate-700 dark:text-slate-400">
          by The Polyglot Pro
        </span>
      </div>
      <span className="flex gap-2 translate-y-0.5">
        <Link
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "dark:text-slate-100 dark:hover:bg-transparent rounded-full",
          )}
          href="/login"
        >
          Log in
        </Link>
        <Link
          className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
          href="/signup"
        >
          Sign up
        </Link>
      </span>
    </header>
  );
};

export default NavBar;
