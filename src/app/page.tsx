import { redirect } from "next/navigation";

export default function Page() {
  // Immediately redirect to login page
  redirect("/home");
}