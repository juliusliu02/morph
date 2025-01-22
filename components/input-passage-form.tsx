"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newDialogueSchema } from "@/lib/validations";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useActionState } from "react";
import { useRef } from "react";
import { createDialogue } from "@/actions/edit";
import { X } from "lucide-react";

function InputPassageForm() {
  const form = useForm<z.output<typeof newDialogueSchema>>({
    resolver: zodResolver(newDialogueSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const [state, formAction, isPending] = useActionState(createDialogue, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        className="space-y-8"
      >
        {state?.message && <X className="bg-red-300">{state.message}</X>}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Title of the article" {...field} />
              </FormControl>
              <FormDescription>This is the title of the text</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Paste in the passage you want to edit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} type="submit" onClick={form.handleSubmit(() => {
          formRef.current?.requestSubmit();
        })}>
          {isPending ? "Loading..." : "Get grammar edit"}
        </Button>
      </form>
    </Form>
  );
}

export default InputPassageForm;
