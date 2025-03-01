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
import React, { useActionState, useRef } from "react";
import { createDialogue } from "@/actions/dialogue";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const InputPassageForm = () => {
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
      <form ref={formRef} action={formAction} className="space-y-8">
        {state?.message && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Title (optional)</FormLabel>
              <FormControl>
                <Input
                  className="mt-2"
                  placeholder="Title of the article"
                  {...field}
                />
              </FormControl>
              <FormDescription>Input the title of the text.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-md">Body</FormLabel>
              <FormControl>
                <Textarea className="mt-2" {...field} />
              </FormControl>
              <FormDescription>
                Paste in the passage you want to edit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="cursor-pointer"
          disabled={isPending}
          type="submit"
          onClick={form.handleSubmit(() => {
            formRef.current?.requestSubmit();
          })}
        >
          {isPending ? "Loading..." : "Get grammar edit"}
        </Button>
      </form>
    </Form>
  );
};

export default InputPassageForm;
