import { auth } from "@/lib/auth";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminLayout
      user={session?.user ? { name: session.user.name, email: session.user.email } : undefined}
    >
      {children}
    </AdminLayout>
  );
}
