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
      <NavigationMenu className="bg-white dark:bg-slate-700 p-1 rounded-xl border-1 border-gray-200 dark:border-slate-600">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/app" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "dark:text-gray-200 dark:bg-slate-700",
                )}
              >
                New Passage
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/app/passages" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "dark:text-gray-200 dark:bg-slate-700",
                )}
              >
                My Passages
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={logout}
              className={cn(
                navigationMenuTriggerStyle(),
                "dark:text-gray-200 dark:bg-slate-700 cursor-pointer",
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
