"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  const notAuthPath = ["/login", "/signup"];
  if (notAuthPath.includes(pathname)) {
    return null;
  }

  return (
    <header className="absolute top-5 flex justify-center w-full">
      <NavigationMenu className="bg-white p-1 rounded-xl border-1 border-gray-200">
        <NavigationMenuList>
          <NavigationMenuItem className="bg">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/passages" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                My Passages
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              onClick={logout}
              className={`${navigationMenuTriggerStyle()} cursor-pointer`}
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
