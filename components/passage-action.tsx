"use client";
import { useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Edit, Version } from "@prisma/client";
import { deleteEdit, getCustomEdit, getPresetEdit } from "@/actions/version";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Pencil, Undo2 } from "lucide-react";

type PassageActionProps = {
  version: Version;
};

type RevertDialogProps = {
  versionId: string;
};

export const RevertDialog = ({ versionId }: RevertDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="destructive" className="cursor-pointer">
        <Undo2 />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Discard this version?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to permanently
          discard this version of the edit?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="destructive"
            className="cursor-pointer"
            aria-label="Delete edit"
            onClick={async () => {
              const response = await deleteEdit(versionId);
              if (response) toast.error(response.message);
            }}
          >
            Discard
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const PassageDropdown = ({ version }: PassageActionProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  // filter out unsupported or invalid edit types.
  const editFilterList = [
    Edit.ORIGINAL,
    version.edit,
    Edit.CUSTOM,
    Edit.SELF,
  ].map((option) => option.valueOf());
  const editOptions = Object.keys(Edit).filter(
    (option) => !editFilterList.includes(option),
  );

  const getEdit = async (edit: string) => {
    setLoading(true);
    const response = await getPresetEdit(version.id, edit);
    setLoading(false);
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
        <Button disabled={loading} className="cursor-pointer">
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              <span className="hidden sm:inline">Loading</span>
            </>
          ) : (
            <>
              <Pencil />
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
};

const PassageAction = ({ version }: PassageActionProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleCustomEdit = async () => {
    if (!ref.current || ref.current.value.trim() === "") {
      toast.error("Custom prompt cannot be empty.");
      return;
    }
    setLoading(true);
    const response = await getCustomEdit(version.id, ref.current.value);
    setLoading(false);
    if (response) {
      toast.error(response.message);
    } else {
      ref.current.value = "";
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <PassageDropdown version={version} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="dark:text-slate-50">
            Custom prompt
          </DialogTitle>
          <DialogDescription>
            Type in your own prompt below to get customized edit.
          </DialogDescription>
        </DialogHeader>
        <Textarea ref={ref} className="text-slate-900 dark:text-slate-200" />
        <DialogFooter>
          <Button
            className="cursor-pointer"
            disabled={loading}
            onClick={handleCustomEdit}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <span className="hidden sm:inline">Loading</span>
              </>
            ) : (
              "Get edit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PassageAction;
