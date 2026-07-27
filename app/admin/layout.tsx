import { auth } from "@/lib/auth";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminLayout
      title="AR SDLC Admin"
      user={session?.user ? { name: session.user.name, email: session.user.email } : undefined}
    >
      {children}
    </AdminLayout>
  );
}
