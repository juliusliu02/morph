import React from "react";

export const CenteredContainer = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="h-svh w-full flex justify-center items-center">
      {children}
    </div>
  );
};
