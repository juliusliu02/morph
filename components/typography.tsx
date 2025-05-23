import React from "react";
import { cn } from "@/lib/utils";
import { type Diff, DiffOp } from "diff-match-patch-ts";

type Props = {
  className?: string;
};

const DeleteText = ({ children }: React.PropsWithChildren<Props>) => {
  return <del className="line-through text-slate-400">{children}</del>;
};

const EqualText = ({ children }: React.PropsWithChildren<Props>) => {
  return <>{children}</>;
};

const InsertText = ({ children }: React.PropsWithChildren<Props>) => {
  return (
    <ins className="text-indigo-800 dark:text-indigo-300 font-semibold no-underline">
      {children}
    </ins>
  );
};

export const DiffWord: React.FC<{ diff: Diff }> = ({ diff }) => {
  switch (diff[0]) {
    case DiffOp.Delete:
      return <DeleteText>{diff[1]}</DeleteText>;
    case DiffOp.Insert:
      return <InsertText>{diff[1]}</InsertText>;
    case DiffOp.Equal:
      return <EqualText>{diff[1]}</EqualText>;
  }
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

export const Description = ({
  children,
  className,
}: React.PropsWithChildren<Props>) => {
  return (
    <p className={cn("text-xl text-slate-500 dark:text-slate-400", className)}>
      {children}
    </p>
  );
};
