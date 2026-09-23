import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function RootPage() {
  const cookieStore = cookies();
  const preferredLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (preferredLocale === "vi") {
    redirect("/vi");
  }
  redirect("/en");
}
