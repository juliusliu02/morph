'use client'
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, Version } from "@prisma/client";
import { getEditById } from "@/actions/edit";
import { Button } from "@/components/ui/button";

type EditDropdownProps = {
  original: Version;
  // setError: (error: string) => void;
}

function EditDropdown({ original }: EditDropdownProps) {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  const editFilterList = [Edit.ORIGINAL, original.edit, Edit.LOGICAL, Edit.CUSTOM].map((option) => option.valueOf());
  const editOptions = Object.keys(Edit).filter((option) => !editFilterList.includes(option));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="mb-12 w-32">
        <Button disabled={isPending} className="font-semibold">{ isPending ? "Loading" : "Get a new edit" }</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
            {editOptions.map((item) => (
              <DropdownMenuItem key={item} onSelect={async () => {
                setIsPending(true);
                await getEditById(original.id, item);
                setIsPending(false);
              }}>
                Get {item.toLowerCase()} edit
              </DropdownMenuItem>
            ))}
    </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default EditDropdown;