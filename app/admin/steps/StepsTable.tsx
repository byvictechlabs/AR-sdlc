"use client";

import { useState, useMemo } from "react";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  ArrowUpDown,
  BookOpen,
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
  SearchInput,
  EmptyState,
  DataTablePagination,
  FormField,
} from "@/components/admin";

interface Step {
  id: string;
  methodId: string;
  meshName: string;
  title: string;
  description: string | null;
  content: string | null;
  imageUrl: string | null;
  audioUrl: string | null;
  stepOrder: number;
  createdAt: Date;
  updatedAt: Date;
  methodName: string | null;
}

interface Method {
  id: string;
  name: string;
}

const PAGE_SIZE = 10;

async function fetchSteps(): Promise<Step[]> {
  const res = await fetch("/api/steps");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export function StepsTable({
  initialData,
  methods,
}: {
  initialData: Step[];
  methods: Method[];
}) {
  const [steps, setSteps] = useState(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [deletingStep, setDeletingStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("all");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    methodId: "",
    meshName: "",
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    audioUrl: "",
    stepOrder: 1,
  });

  const filtered = useMemo(() => {
    let result = steps;
    if (filterMethod !== "all")
      result = result.filter((s) => s.methodId === filterMethod);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.meshName.toLowerCase().includes(q) ||
          (s.methodName && s.methodName.toLowerCase().includes(q))
      );
    }
    return result;
  }, [steps, filterMethod, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  if (page > totalPages && totalPages > 0) setPage(totalPages);

  function openCreate() {
    setEditingStep(null);
    setForm({
      methodId: methods[0]?.id || "",
      meshName: "",
      title: "",
      description: "",
      content: "",
      imageUrl: "",
      audioUrl: "",
      stepOrder: 1,
    });
    setErrors({});
    setDialogOpen(true);
  }

  function openEdit(step: Step) {
    setEditingStep(step);
    setForm({
      methodId: step.methodId,
      meshName: step.meshName,
      title: step.title,
      description: step.description || "",
      content: step.content || "",
      imageUrl: step.imageUrl || "",
      audioUrl: step.audioUrl || "",
      stepOrder: step.stepOrder,
    });
    setErrors({});
    setDialogOpen(true);
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.methodId) newErrors.methodId = "Method is required";
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.meshName.trim()) newErrors.meshName = "Mesh name is required";
    else if (!/^[A-Z0-9_]+$/.test(form.meshName))
      newErrors.meshName = "Must be uppercase with underscores";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
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
          methodId: form.methodId,
          meshName: form.meshName.trim().toUpperCase(),
          title: form.title.trim(),
          description: form.description.trim() || null,
          content: form.content.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
          audioUrl: form.audioUrl.trim() || null,
          stepOrder: Number(form.stepOrder),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        if (data.details) {
          setErrors(data.details);
        }
        throw new Error(data.error || "Failed to save");
      }
      const updated = await fetchSteps();
      setSteps(updated);
      toast.success(editingStep ? "Step updated" : "Step created");
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
    if (!deletingStep) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/steps/${deletingStep.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      const updated = await fetchSteps();
      setSteps(updated);
      toast.success("Step deleted");
      setDeleteDialogOpen(false);
      setDeletingStep(null);
    } catch {
      toast.error("Failed to delete step");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Steps"
        description="Manage the learning steps for each SDLC method."
        icon={Layers}
        actions={
          <Button onClick={openCreate} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Step
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Total Steps"
          value={steps.length}
          icon={Layers}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
        <StatCard
          title="Methods"
          value={methods.length}
          icon={Layers}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-border/60 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <SearchInput
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search by title, mesh name..."
              className="w-full sm:w-72"
            />
            <select
              value={filterMethod}
              onChange={(e) => {
                setFilterMethod(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-border/60 bg-white px-3 text-sm text-foreground"
            >
              <option value="all">All Methods</option>
              {methods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground w-12">
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="h-3 w-3" />
                  #
                </div>
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Method
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Title
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Mesh Name
              </TableHead>
              <TableHead className="h-10 px-6 text-xs font-medium uppercase tracking-wide text-muted-foreground w-24 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5}>
                  <EmptyState
                    title="No steps found"
                    description={
                      search || filterMethod !== "all"
                        ? "Try adjusting your search or filter criteria."
                        : "Get started by creating your first learning step."
                    }
                    icon={Layers}
                    action={
                      !search && filterMethod === "all" ? (
                        <Button onClick={openCreate} size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Step
                        </Button>
                      ) : undefined
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((step) => (
                <TableRow
                  key={step.id}
                  className="group border-b border-border/30 transition-colors hover:bg-slate-50/50"
                >
                  {/* Step Order */}
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md bg-slate-100 px-1.5 text-xs font-medium text-slate-700">
                      {step.stepOrder}
                    </span>
                  </TableCell>

                  {/* Method Badge */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {step.methodName || "Unknown"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell className="px-6 py-4">
                    <p className="font-medium text-foreground">{step.title}</p>
                    {step.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground truncate max-w-[240px]">
                        {step.description}
                      </p>
                    )}
                  </TableCell>

                  {/* Mesh Name Badge */}
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-medium text-slate-700">
                      {step.meshName}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="border-transparent bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => openEdit(step)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="border-transparent bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                          setDeletingStep(step);
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

        {/* Pagination */}
        <DataTablePagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
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
          <div className="space-y-4 py-2">
            <FormField
              label="Method"
              htmlFor="methodId"
              required
              error={errors.methodId}
            >
              <select
                id="methodId"
                value={form.methodId}
                onChange={(e) => {
                  setForm({ ...form, methodId: e.target.value });
                  if (errors.methodId)
                    setErrors({ ...errors, methodId: "" });
                }}
                className={`flex h-9 w-full rounded-lg border bg-white px-3 py-2 text-sm ${
                  errors.methodId ? "border-destructive" : "border-border"
                }`}
              >
                <option value="">Select a method</option>
                {methods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Title"
                htmlFor="title"
                required
                error={errors.title}
              >
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    if (errors.title)
                      setErrors({ ...errors, title: "" });
                  }}
                  placeholder="e.g. Requirements"
                  className={errors.title ? "border-destructive" : ""}
                />
              </FormField>
              <FormField
                label="Mesh Name"
                htmlFor="meshName"
                required
                error={errors.meshName}
              >
                <Input
                  id="meshName"
                  value={form.meshName}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      meshName: e.target.value.toUpperCase(),
                    });
                    if (errors.meshName)
                      setErrors({ ...errors, meshName: "" });
                  }}
                  placeholder="e.g. WF_REQUIREMENTS"
                  className={`font-mono ${
                    errors.meshName ? "border-destructive" : ""
                  }`}
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
                placeholder="Describe this learning step"
                rows={3}
              />
            </FormField>
            <FormField label="Content" htmlFor="content">
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                placeholder="Full learning content for this step"
                rows={4}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Image URL" htmlFor="imageUrl">
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.png"
                />
              </FormField>
              <FormField label="Audio URL" htmlFor="audioUrl">
                <Input
                  id="audioUrl"
                  value={form.audioUrl}
                  onChange={(e) =>
                    setForm({ ...form, audioUrl: e.target.value })
                  }
                  placeholder="https://example.com/audio.mp3"
                />
              </FormField>
            </div>
            <FormField label="Step Order" htmlFor="stepOrder">
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
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Step"
        description={`Are you sure you want to delete "${deletingStep?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
