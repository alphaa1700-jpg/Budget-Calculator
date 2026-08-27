"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteRecord } from "@/app/actions";

interface DataTableActionsProps {
  sheetName: string;
  recordId: string;
  recordName?: string;
  onEdit?: () => void;
}

export function DataTableActions({ sheetName, recordId, recordName = "Item", onEdit }: DataTableActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete this ${recordName}?`)) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteRecord(sheetName, recordId);
      if (result.success) {
        toast.success(`${recordName} deleted successfully`);
      } else {
        toast.error(`Failed to delete ${recordName}: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Error deleting ${recordName}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
          <span className="sr-only">Open menu</span>
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDelete} className="text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:focus:bg-rose-950">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
