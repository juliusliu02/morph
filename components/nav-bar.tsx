import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { cn } from "@/lib/utils";

const NavBar = () => {
  return (
    <header className="absolute top-5 flex justify-center w-full">
      <NavigationMenu className="bg-white dark:bg-slate-700 p-1 rounded-xl border-1 border-slate-200 dark:border-slate-600">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                "dark:text-slate-200 dark:bg-slate-700",
              )}
            >
              <Link href="/app">New Passage</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                "dark:text-slate-200 dark:bg-slate-700",
              )}
            >
              <Link href="/app/passages">My Passages</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={logout}
              className={cn(
                navigationMenuTriggerStyle(),
                "dark:text-slate-200 dark:bg-slate-700 cursor-pointer",
              )}
            >
              Log out
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default NavBar;
