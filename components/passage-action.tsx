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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Version } from "@prisma/client";
import { getCustomEdit, getPresetEdit } from "@/actions/edit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

type PassageActionProps = {
  version: Version;
};

function PassageDropdown({ version }: PassageActionProps) {
  const [isPending, setIsPending] = React.useState<boolean>(false);

  // filter out unsupported or invalid edit types.
  const editFilterList = [
    Edit.ORIGINAL,
    version.edit,
    Edit.LOGICAL,
    Edit.CUSTOM,
  ].map((option) => option.valueOf());
  const editOptions = Object.keys(Edit).filter(
    (option) => !editFilterList.includes(option),
  );

  const getEdit = async (edit: string) => {
    setIsPending(true);
    const response = await getPresetEdit(version.id, edit);
    setIsPending(false);
    // response is void on success
    if (response) {
      toast.error("An error occurred.", {
        description: response.message,
        action: {
          label: "Retry",
          onClick: () => getEdit(edit),
        },
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isPending} className="cursor-pointer">
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Loading
            </>
          ) : (
            <>
              <Pencil />{" "}
              <span className="hidden sm:inline">Get a new edit</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {editOptions.map((item) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={item}
            onSelect={() => getEdit(item)}
          >
            Get {item.toLowerCase()} edit
          </DropdownMenuItem>
        ))}
        <DialogTrigger asChild>
          <DropdownMenuItem className="cursor-pointer">
            Use my own prompt
          </DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const PassageAction = ({ version }: PassageActionProps) => {
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSubmit = async (prompt: string) => {
    setLoading(true);
    const response = await getCustomEdit(version.id, prompt);
    setLoading(false);
    if (response) {
      toast.error(response.message);
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <PassageDropdown version={version} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom edit</DialogTitle>
          <DialogDescription>
            Input prompt below to get customized edit.
          </DialogDescription>
        </DialogHeader>
        <Textarea onChange={(e) => setPrompt(e.target.value)} value={prompt} />
        <DialogFooter>
          <Button
            className="cursor-pointer"
            disabled={loading}
            onClick={() => handleSubmit(prompt)}
          >
            Get edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PassageAction;
