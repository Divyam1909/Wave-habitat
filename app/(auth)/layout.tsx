// In app/(auth)/layout.tsx

import { InteractiveWaveBackground } from "@/components/ui/interactive-wave-background";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InteractiveWaveBackground />
      {/* The rest of the layout will be handled by the page */}
      {children}
    </>
  );
}