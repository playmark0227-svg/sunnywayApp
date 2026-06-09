import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { WelcomeFlow } from "@/components/app/WelcomeFlow";

export default async function Home() {
  const session = await getSession();
  if (session?.role === "INFLUENCER") redirect("/app");
  if (session?.role === "ADMIN") redirect("/admin");
  return <WelcomeFlow />;
}
