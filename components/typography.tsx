import React from "react";

export const Title = ({ children }: React.PropsWithChildren) => {
  return (
    <h1 className="pb-2 text-3xl font-semibold tracking-tight transition-colors">
      {children}
    </h1>
  );
};

export const Subtitle = ({ children }: React.PropsWithChildren) => {
  return <h2 className="text-xl text-muted-foreground">{children}</h2>;
};
