"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Version } from "@prisma/client";
import { getEditById } from "@/actions/edit";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

type EditDropdownProps = {
  original: Version;
};

function EditDropdown({ original }: EditDropdownProps) {
  const [isPending, setIsPending] = React.useState<boolean>(false);
  const { toast } = useToast();

  const editFilterList = [
    Edit.ORIGINAL,
    original.edit,
    Edit.LOGICAL,
    Edit.CUSTOM,
  ].map((option) => option.valueOf());
  const editOptions = Object.keys(Edit).filter(
    (option) => !editFilterList.includes(option),
  );

  const getEdit = async (edit: string) => {
    setIsPending(true);
    const response = await getEditById(original.id, edit);
    setIsPending(false);
    // error
    if (response) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: response.message,
        action: (
          <ToastAction onClick={() => getEdit(edit)} altText="Try again">
            Try again
          </ToastAction>
        ),
      });
    }
    // success
    else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-32">
        <Button disabled={isPending} className="font-semibold cursor-pointer">
          {isPending ? "Loading" : "Get a new edit"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {editOptions.map((item) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={item}
            onSelect={() => getEdit(item)}
          >
            Get {item.toLowerCase()} edit
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default EditDropdown;
