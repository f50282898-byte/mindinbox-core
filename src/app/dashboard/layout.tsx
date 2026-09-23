import Gatekeeper from "@/components/auth/Gatekeeper";
import UrgencyBanner from "@/components/marketing/UrgencyBanner";
import VIPUpgradeModal from "@/components/marketing/VIPUpgradeModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Gatekeeper>
      <UrgencyBanner />
      {children}
      <VIPUpgradeModal />
    </Gatekeeper>
  );
}

