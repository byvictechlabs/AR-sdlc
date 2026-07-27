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

interface Step {
  id: string;
  methodId: string;
  meshName: string;
  title: string;
  description: string | null;
  stepOrder: number;
  createdAt: Date;
  updatedAt: Date;
  methodName: string | null;
}

interface Method {
  id: string;
  name: string;
}

export function StepsTable({
  initialData,
  methods,
}: {
  initialData: Step[];
  methods: Method[];
}) {
  const router = useRouter();
  const [steps] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [deletingStep, setDeletingStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    methodId: "",
    meshName: "",
    title: "",
    description: "",
    stepOrder: 1,
  });

  function openCreate() {
    setEditingStep(null);
    setForm({
      methodId: methods[0]?.id || "",
      meshName: "",
      title: "",
      description: "",
      stepOrder: 1,
    });
    setDialogOpen(true);
  }

  function openEdit(step: Step) {
    setEditingStep(step);
    setForm({
      methodId: step.methodId,
      meshName: step.meshName,
      title: step.title,
      description: step.description || "",
      stepOrder: step.stepOrder,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const url = editingStep
        ? `/api/steps/${editingStep.id}`
        : "/api/steps";
      const method = editingStep ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          stepOrder: Number(form.stepOrder),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save step");
      }

      toast.success(editingStep ? "Step updated" : "Step created");
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingStep) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/steps/${deletingStep.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete step");
      }

      toast.success("Step deleted");
      setDeleteDialogOpen(false);
      setDeletingStep(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete step");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end">
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Mesh Name</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No steps found. Click &quot;Add Step&quot; to create one.
                </TableCell>
              </TableRow>
            ) : (
              steps.map((step) => (
                <TableRow key={step.id}>
                  <TableCell className="text-muted-foreground">
                    {step.stepOrder}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{step.methodName || "Unknown"}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{step.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {step.meshName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(step)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setDeletingStep(step);
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
              {editingStep ? "Edit Step" : "Create Step"}
            </DialogTitle>
            <DialogDescription>
              {editingStep
                ? "Update the step details below."
                : "Add a new learning step."}
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
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Requirements"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meshName">Mesh Name</Label>
                <Input
                  id="meshName"
                  value={form.meshName}
                  onChange={(e) =>
                    setForm({ ...form, meshName: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. WF_REQUIREMENTS"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Must match the 3D model mesh name
                </p>
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
                placeholder="Describe this learning step"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stepOrder">Step Order</Label>
              <Input
                id="stepOrder"
                type="number"
                min="1"
                value={form.stepOrder}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stepOrder: parseInt(e.target.value) || 1,
                  })
                }
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
            <DialogTitle>Delete Step</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingStep?.title}&quot;? This action
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
