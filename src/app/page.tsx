import { AppProvider } from "@/lib/app-context";
import Shell from "@/components/Shell";

export default function Home() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
