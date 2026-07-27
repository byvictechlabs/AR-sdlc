"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Method {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  modelPath: string;
  markerPath: string;
  categoryId: string | null;
  status: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export function MethodsTable({ initialData }: { initialData: Method[] }) {
  const router = useRouter();
  const [methods] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [deletingMethod, setDeletingMethod] = useState<Method | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    slug: "",
    modelPath: "",
    markerPath: "",
    status: "draft" as string,
    sortOrder: 0,
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
    });
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
    });
    setDialogOpen(true);
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSave() {
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
          ...form,
          sortOrder: Number(form.sortOrder),
          categoryId: null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save method");
      }

      toast.success(editingMethod ? "Method updated" : "Method created");
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
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

      if (!response.ok) {
        throw new Error("Failed to delete method");
      }

      toast.success("Method deleted");
      setDeleteDialogOpen(false);
      setDeletingMethod(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete method");
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Published
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            Draft
          </Badge>
        );
      case "archived":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            Archived
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  }

  return (
    <>
      <div className="flex items-center justify-end">
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Method
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No methods found. Click &quot;Add Method&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              methods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{method.slug}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(method.status)}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {method.modelPath}
                  </TableCell>
                  <TableCell>{method.sortOrder}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(method)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeletingMethod(method);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: form.slug || generateSlug(e.target.value),
                    });
                  }}
                  placeholder="e.g. Waterfall"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. waterfall"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe this SDLC method"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelPath">Model Path (GLB)</Label>
                <Input
                  id="modelPath"
                  value={form.modelPath}
                  onChange={(e) =>
                    setForm({ ...form, modelPath: e.target.value })
                  }
                  placeholder="/models/waterfall.glb"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="markerPath">Marker Path</Label>
                <Input
                  id="markerPath"
                  value={form.markerPath}
                  onChange={(e) =>
                    setForm({ ...form, markerPath: e.target.value })
                  }
                  placeholder="/markers/waterfall.png"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingMethod?.name}&quot;? This will also delete
              all associated steps. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
