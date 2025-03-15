"use client"; // Error boundaries must be Client Components

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-xl ">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-rose-700 dark:text-rose-300">
            An error has occurred.
          </CardTitle>
        </CardHeader>
        <CardContent>{error.message}</CardContent>
        <CardFooter>
          <Button variant="outline" onClick={reset}>
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
