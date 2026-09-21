"use client";

import { useState } from "react";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Box,
  ArrowUpDown,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  PageHeader,
  StatCard,
  DeleteDialog,
  StatusBadge,
  getMethodStatusVariant,
  SearchInput,
  EmptyState,
  FormField,
} from "@/components/admin";

interface Method {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  modelPath: string;
  markerPath: string;
  status: string;
  sortOrder: number;
  mindTargetIndex: number | null;
  createdAt: Date;
  updatedAt: Date;
}

async function fetchMethods(): Promise<Method[]> {
  const res = await fetch("/api/methods");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function MethodsTable({ initialData }: { initialData: Method[] }) {
  const [methods, setMethods] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [deletingMethod, setDeletingMethod] = useState<Method | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [form, setForm] = useState({
    name: "",
    description: "",
    slug: "",
    modelPath: "",
    markerPath: "",
    status: "draft",
    sortOrder: 0,
    mindTargetIndex: "" as string,
  });

  function openCreate() {
    setEditingMethod(null);
    setForm({
      name: "",
      description: "",
      slug: "",
      modelPath: "",
      markerPath: "",
      status: "draft",
      sortOrder: 0,
      mindTargetIndex: "",
    });
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(method: Method) {
    setEditingMethod(method);
    setForm({
      name: method.name,
      description: method.description || "",
      slug: method.slug,
      modelPath: method.modelPath,
      markerPath: method.markerPath,
      status: method.status,
      sortOrder: method.sortOrder,
      mindTargetIndex: method.mindTargetIndex !== null ? String(method.mindTargetIndex) : "",
    });
    setErrors({});
    setDialogOpen(true);
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.slug.trim()) newErrors.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      newErrors.slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    if (!form.modelPath.trim()) newErrors.modelPath = "Model path is required";
    if (!form.markerPath.trim())
      newErrors.markerPath = "Marker path is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const filtered = methods.filter((m) => {
    if (filterStatus !== "all" && m.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const publishedCount = methods.filter((m) => m.status === "published").length;
  const draftCount = methods.filter((m) => m.status === "draft").length;

  async function handleSave() {
    if (!validate()) return;
    setLoading(true);
    try {
      const url = editingMethod
        ? `/api/methods/${editingMethod.id}`
        : "/api/methods";
      const method = editingMethod ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || null,
          modelPath: form.modelPath.trim(),
          markerPath: form.markerPath.trim(),
          status: form.status,
          sortOrder: Number(form.sortOrder),
          mindTargetIndex: form.mindTargetIndex !== "" ? Number(form.mindTargetIndex) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.details) {
          setErrors(data.details);
        }
        throw new Error(data.error || "Failed to save method");
      }

      const updated = await fetchMethods();
      setMethods(updated);
      toast.success(editingMethod ? "Method updated" : "Method created");
      setDialogOpen(false);
      setErrors({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingMethod) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/methods/${deletingMethod.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");

      const updated = await fetchMethods();
      setMethods(updated);
      toast.success("Method deleted");
      setDeleteDialogOpen(false);
      setDeletingMethod(null);
    } catch {
      toast.error("Failed to delete method");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Methods"
        description="Manage SDLC methods and their related 3D models."
        icon={BookOpen}
        actions={
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Method
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Methods"
          value={methods.length}
          icon={BookOpen}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Published"
          value={publishedCount}
          icon={BookOpen}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Drafts"
          value={draftCount}
          icon={BookOpen}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
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
              placeholder="Search methods..."
              className="w-full sm:w-72"
            />
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-9 rounded-lg border border-border/60 bg-white px-3 text-sm text-foreground"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Slug
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Model
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground w-20">
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" />
                  Order
                </div>
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground w-24">
                Target Index
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground w-24 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={7}>
                  <EmptyState
                    title="No methods found"
                    description={
                      search
                        ? "Try adjusting your search or filter criteria."
                        : "Get started by creating your first SDLC method."
                    }
                    icon={BookOpen}
                    action={
                      !search ? (
                        <Button onClick={openCreate} size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Method
                        </Button>
                      ) : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((method) => (
                <TableRow
                  key={method.id}
                  className="group border-b border-border/30 transition-colors hover:bg-slate-50/50"
                >
                  {/* Method Name + Description */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {method.name}
                        </p>
                        {method.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground truncate max-w-[240px]">
                            {method.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Slug Badge */}
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {method.slug}
                    </span>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="px-6 py-4">
                    <StatusBadge
                      label={
                        method.status.charAt(0).toUpperCase() +
                        method.status.slice(1)
                      }
                      variant={getMethodStatusVariant(method.status)}
                      showDot
                    />
                  </TableCell>

                  {/* Model Path */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Box className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono text-xs truncate max-w-[180px]">
                        {method.modelPath}
                      </span>
                    </div>
                  </TableCell>

                  {/* Order Badge */}
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-slate-100 px-1.5 text-xs font-medium text-slate-700">
                      {method.sortOrder}
                    </span>
                  </TableCell>

                  {/* MindAR Target Index */}
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-purple-50 px-1.5 text-xs font-medium text-purple-700">
                      {method.mindTargetIndex !== null ? method.mindTargetIndex : "—"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="border-transparent bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => openEdit(method)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="border-transparent bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                          setDeletingMethod(method);
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMethod ? "Edit Method" : "Create Method"}
            </DialogTitle>
            <DialogDescription>
              {editingMethod
                ? "Update the method details below."
                : "Add a new SDLC method."}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto space-y-4 py-2 pr-1">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Name" htmlFor="name" required error={errors.name}>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: form.slug || generateSlug(e.target.value),
                    });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder="e.g. Waterfall"
                  className={errors.name ? "border-destructive" : ""}
                />
              </FormField>
              <FormField label="Slug" htmlFor="slug" required error={errors.slug}>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setForm({ ...form, slug: e.target.value });
                    if (errors.slug) setErrors({ ...errors, slug: "" });
                  }}
                  placeholder="e.g. waterfall"
                  className={errors.slug ? "border-destructive" : ""}
                />
              </FormField>
            </div>
            <FormField label="Description" htmlFor="description">
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe this SDLC method"
                rows={3}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Model Path (GLB)"
                htmlFor="modelPath"
                required
                error={errors.modelPath}
              >
                <Input
                  id="modelPath"
                  value={form.modelPath}
                  onChange={(e) => {
                    setForm({ ...form, modelPath: e.target.value });
                    if (errors.modelPath)
                      setErrors({ ...errors, modelPath: "" });
                  }}
                  placeholder="/models/waterfall.glb"
                  className={errors.modelPath ? "border-destructive" : ""}
                />
              </FormField>
              <FormField
                label="Marker Path"
                htmlFor="markerPath"
                required
                error={errors.markerPath}
              >
                <Input
                  id="markerPath"
                  value={form.markerPath}
                  onChange={(e) => {
                    setForm({ ...form, markerPath: e.target.value });
                    if (errors.markerPath)
                      setErrors({ ...errors, markerPath: "" });
                  }}
                  placeholder="/markers/waterfall.png"
                  className={errors.markerPath ? "border-destructive" : ""}
                />
              </FormField>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Status" htmlFor="status">
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="flex h-9 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </FormField>
              <FormField label="Sort Order" htmlFor="sortOrder">
                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </FormField>
              <FormField label="MindAR Target Index" htmlFor="mindTargetIndex">
                <Input
                  id="mindTargetIndex"
                  type="number"
                  min="0"
                  value={form.mindTargetIndex}
                  onChange={(e) =>
                    setForm({ ...form, mindTargetIndex: e.target.value })
                  }
                  placeholder="e.g. 0"
                />
              </FormField>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Method"
        description={`Are you sure you want to delete "${deletingMethod?.name}"? This will also delete all associated steps.`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
