import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirige automatiquement vers le Customer Home
  // redirect("/admin ");
  redirect("/home");
}
