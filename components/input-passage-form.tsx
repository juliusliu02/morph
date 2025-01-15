"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "@/lib/validations";

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
import React, { useActionState, useEffect } from "react";
import { useRef } from "react";
import { getGrammarEdit } from "@/actions/morph";
import { X } from "lucide-react";
import { PassagePair } from "@/lib/types";

type InputPassageFormProps = {
  setFirstPass: React.Dispatch<React.SetStateAction<PassagePair | null>>;
};

function InputPassageForm({ setFirstPass }: InputPassageFormProps) {
  const form = useForm<z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const [state, formAction, isPending] = useActionState(getGrammarEdit, null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.passagePair) {
      setFirstPass(state.passagePair);
    }
  }, [setFirstPass, state]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={form.handleSubmit(() => {
          formRef.current?.submit();
        })}
        className="space-y-8"
      >
        {state?.error && <X>{state.error}</X>}
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
        <Button disabled={isPending} type="submit">
          {isPending ? "Loading..." : "Get grammar edit"}
        </Button>
      </form>
    </Form>
  );
}

export default InputPassageForm;
