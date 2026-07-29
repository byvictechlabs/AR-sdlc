"use client";

import { useState } from "react";
import { Users, Plus, Trash2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  PageHeader,
  StatCard,
  DeleteDialog,
  StatusBadge,
  SearchInput,
  EmptyState,
  FormField,
} from "@/components/admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function UsersTable({ initialData }: { initialData: User[] }) {
  const [users, setUsers] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  const superAdminCount = users.filter((u) => u.role === "super_admin").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  async function handleCreate() {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        if (data.details) {
          setErrors(data.details);
        }
        throw new Error(data.error || "Failed to create user");
      }
      const updated = await fetchUsers();
      setUsers(updated);
      toast.success("User created");
      setDialogOpen(false);
      setErrors({});
      setForm({ name: "", email: "", password: "", role: "admin" });
      setErrors({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingUser) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${deletingUser.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      const updated = await fetchUsers();
      setUsers(updated);
      toast.success("User deleted");
      setDeleteDialogOpen(false);
      setDeletingUser(null);
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage admin accounts and roles."
        icon={Users}
        actions={
          <Button
            onClick={() => {
              setErrors({});
              setDialogOpen(true);
            }}
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Super Admins"
          value={superAdminCount}
          icon={Shield}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          title="Admins"
          value={adminCount}
          icon={User}
          iconColor="text-slate-600"
          iconBg="bg-slate-100"
        />
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search users..."
              className="w-full sm:w-72"
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                User
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Role
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground w-24 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={4}>
                  <EmptyState
                    title="No users found"
                    description={
                      search
                        ? "Try adjusting your search criteria."
                        : "No admin accounts have been created yet."
                    }
                    icon={Users}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow
                  key={user.id}
                  className="group border-b border-border/30 transition-colors hover:bg-slate-50/50"
                >
                  {/* User Name + Avatar */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="font-medium text-foreground">
                        {user.name}
                      </p>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>

                  {/* Role Badge */}
                  <TableCell className="px-6 py-4">
                    <StatusBadge
                      label={
                        user.role === "super_admin"
                          ? "Super Admin"
                          : "Admin"
                      }
                      variant={
                        user.role === "super_admin" ? "default" : "secondary"
                      }
                      showDot
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="border-transparent bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                          setDeletingUser(user);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Add a new admin account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <FormField
              label="Name"
              htmlFor="name"
              required
              error={errors.name}
            >
              <Input
                id="name"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                placeholder="Full name"
                className={errors.name ? "border-destructive" : ""}
              />
            </FormField>
            <FormField
              label="Email"
              htmlFor="email"
              required
              error={errors.email}
            >
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="admin@example.com"
                className={errors.email ? "border-destructive" : ""}
              />
            </FormField>
            <FormField
              label="Password"
              htmlFor="password"
              required
              error={errors.password}
            >
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errors.password)
                    setErrors({ ...errors, password: "" });
                }}
                placeholder="Minimum 6 characters"
                className={errors.password ? "border-destructive" : ""}
              />
            </FormField>
            <FormField label="Role" htmlFor="role">
              <select
                id="role"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="flex h-9 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </FormField>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete "${deletingUser?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
