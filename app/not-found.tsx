import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Page not found.
          </CardTitle>
        </CardHeader>
        <CardContent>
          Please check to make sure the URL is correct. Click{" "}
          <Link href="/" className="text-indigo-600">
            here
          </Link>{" "}
          to go back to homepage.
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
