import { ProfileProvider } from "@/contexts/ProfileContext";

export default function FreeSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfileProvider>{children}</ProfileProvider>;
}

