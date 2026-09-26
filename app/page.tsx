import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const cookieStore = await cookies();
  const preferredLocale = cookieStore.get("NEXT_LOCALE")?.value;
  if (preferredLocale === "vi") {
    redirect("/vi");
  }
  redirect("/en");
}
