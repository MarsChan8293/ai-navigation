"use client";

import { useState } from "react";
import { Category } from "@/lib/types";
import { useAtom } from "jotai";
import { categoriesAtom } from "@/lib/atoms";
import { Button } from "@/ui/common/button";
import { Input } from "@/ui/common/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/common/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/ui/common/dialog";
import { Label } from "@/ui/common/label";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/common/alert-dialog";

export function CategoryManager() {
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!formData.name || !formData.slug) {
        toast({ title: "错误", description: "请填写完整信息", variant: "destructive" });
        return;
    }
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const response = await res.json();
      
      if (res.ok && response.code === 200) {
          setCategories([...categories, response.data]);
          setIsAddDialogOpen(false);
          setFormData({ name: "", slug: "" });
          toast({ title: "成功", description: "分类已添加" });
      } else {
          throw new Error(response.message || "Failed");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast({ title: "错误", description: (error as any).message || "添加分类失败", variant: "destructive" });
    }
  };

  const handleEdit = async () => {
    if (!currentCategory) return;
    if (!formData.name || !formData.slug) {
        toast({ title: "错误", description: "请填写完整信息", variant: "destructive" });
        return;
    }
    try {
      const res = await fetch(`/api/categories/${currentCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const response = await res.json();
      if (res.ok && response.code === 200) {
          setCategories(categories.map(c => c.id === currentCategory.id ? response.data : c));
          setIsEditDialogOpen(false);
          setCurrentCategory(null);
          setFormData({ name: "", slug: "" });
          toast({ title: "成功", description: "分类已更新" });
      } else {
           throw new Error(response.message || "Failed");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast({ title: "错误", description: (error as any).message || "更新分类失败", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const response = await res.json();
      if (res.ok && response.code === 200) {
          setCategories(categories.filter(c => c.id !== id));
          toast({ title: "成功", description: "分类已删除" });
      } else {
          throw new Error(response.message || "Failed");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast({ title: "错误", description: (error as any).message || "删除分类失败", variant: "destructive" });
    }
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setFormData({ name: category.name, slug: category.slug });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">分类列表</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              添加分类
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新分类</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">名称</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例如：AI 写作"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL 标识)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="例如：ai-writing"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
              <Button onClick={handleAdd}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除？</AlertDialogTitle>
                        <AlertDialogDescription>
                          此操作无法撤销。删除分类可能会影响属于该分类的网站。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          删除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        暂无分类
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑分类</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">名称</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>保存更改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
