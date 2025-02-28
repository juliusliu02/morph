"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ellipsis } from "lucide-react";
import { deleteDialogue } from "@/actions/edit";
import { Button } from "@/components/ui/button";

type PassageListItemActionProps = {
  id: string;
};

const PassageListItemAction = ({ id }: PassageListItemActionProps) => {
  return (
    <menu onClick={(e) => e.stopPropagation()}>
      <Dialog>
        <PassageDropdown />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this passage?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={async () => {
                  await deleteDialogue(id);
                }}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </menu>
  );
};

const PassageDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Ellipsis className="translate-y-[0.1rem] text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DialogTrigger asChild onClick={(event) => event.stopPropagation()}>
          <DropdownMenuItem>Delete passage</DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PassageListItemAction;
