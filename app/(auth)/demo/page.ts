import { redirect } from "next/navigation";

export async function page() {
  redirect("/api/demo");
}

export default page;
