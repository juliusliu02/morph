import React from "react";
import NavBar from "@/components/landing/nav-bar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

export default Layout;
