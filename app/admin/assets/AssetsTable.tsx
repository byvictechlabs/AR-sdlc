"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Box } from "lucide-react";
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

interface Asset {
  id: string;
  methodId: string;
  name: string;
  description: string | null;
  filePath: string;
  fileFormat: string;
  fileSize: number | null;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  methodName: string | null;
}

interface Method {
  id: string;
  name: string;
}

export function AssetsTable({
  initialData,
  methods,
}: {
  initialData: Asset[];
  methods: Method[];
}) {
  const router = useRouter();
  const [assets] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    methodId: "",
    name: "",
    description: "",
    filePath: "",
    fileFormat: "glb",
    fileSize: "",
    version: "1.0",
  });

  function openCreate() {
    setEditingAsset(null);
    setForm({
      methodId: methods[0]?.id || "",
      name: "",
      description: "",
      filePath: "",
      fileFormat: "glb",
      fileSize: "",
      version: "1.0",
    });
    setDialogOpen(true);
  }

  function openEdit(asset: Asset) {
    setEditingAsset(asset);
    setForm({
      methodId: asset.methodId,
      name: asset.name,
      description: asset.description || "",
      filePath: asset.filePath,
      fileFormat: asset.fileFormat,
      fileSize: asset.fileSize?.toString() || "",
      version: asset.version,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const url = editingAsset
        ? `/api/assets/${editingAsset.id}`
        : "/api/assets";
      const method = editingAsset ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fileSize: form.fileSize ? parseInt(form.fileSize) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save asset");
      }

      toast.success(editingAsset ? "Asset updated" : "Asset created");
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingAsset) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/assets/${deletingAsset.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete asset");
      }

      toast.success("Asset deleted");
      setDeleteDialogOpen(false);
      setDeletingAsset(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete asset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end">
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Version</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No 3D assets found. Click &quot;Add Asset&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Box className="h-4 w-4 text-muted-foreground" />
                      {asset.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{asset.methodName || "Unknown"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="uppercase">
                      {asset.fileFormat}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs max-w-[200px] truncate">
                    {asset.filePath}
                  </TableCell>
                  <TableCell>{asset.version}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(asset)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeletingAsset(asset);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAsset ? "Edit Asset" : "Create Asset"}
            </DialogTitle>
            <DialogDescription>
              {editingAsset
                ? "Update the asset details below."
                : "Add a new 3D asset reference."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="methodId">Method</Label>
              <select
                id="methodId"
                value={form.methodId}
                onChange={(e) =>
                  setForm({ ...form, methodId: e.target.value })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a method</option>
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="e.g. Waterfall Model"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={form.version}
                  onChange={(e) =>
                    setForm({ ...form, version: e.target.value })
                  }
                  placeholder="1.0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filePath">File Path</Label>
              <Input
                id="filePath"
                value={form.filePath}
                onChange={(e) =>
                  setForm({ ...form, filePath: e.target.value })
                }
                placeholder="/models/waterfall.glb"
                className="font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fileFormat">Format</Label>
                <select
                  id="fileFormat"
                  value={form.fileFormat}
                  onChange={(e) =>
                    setForm({ ...form, fileFormat: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="glb">GLB</option>
                  <option value="gltf">GLTF</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileSize">File Size (bytes, optional)</Label>
                <Input
                  id="fileSize"
                  type="number"
                  value={form.fileSize}
                  onChange={(e) =>
                    setForm({ ...form, fileSize: e.target.value })
                  }
                  placeholder="e.g. 1024000"
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
                placeholder="Optional description"
              />
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
            <DialogTitle>Delete Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingAsset?.name}&quot;? This action
              cannot be undone.
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
