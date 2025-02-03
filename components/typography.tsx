import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export const Title = (props: React.PropsWithChildren<Props>) => {
  return (
    <h1
      className={cn(
        "pb-2 text-3xl font-semibold tracking-tight transition-colors",
        props.className,
      )}
    >
      {props.children}
    </h1>
  );
};

export const Subtitle = ({
  children,
  className,
}: React.PropsWithChildren<Props>) => {
  return (
    <h2 className={cn("text-xl text-muted-foreground", className)}>
      {children}
    </h2>
  );
};
