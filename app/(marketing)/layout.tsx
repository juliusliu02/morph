import React from "react";
import NavBar from "@/components/landing/nav-bar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full relative">
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
