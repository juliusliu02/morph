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
import { deleteDialogue } from "@/actions/dialogue";
import { Button } from "@/components/ui/button";

type PassageListItemActionProps = {
  id: string;
};

const PassageListItemAction = ({ id }: PassageListItemActionProps) => {
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Passage Action">
            <Ellipsis className="translate-y-[1px] text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DialogTrigger asChild>
              <DropdownMenuItem>Delete passage</DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
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
              <Button variant="secondary">Close</Button>
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
    </div>
  );
};

export default PassageListItemAction;
