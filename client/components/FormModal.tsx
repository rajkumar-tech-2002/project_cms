import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export default function FormModal({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false,
}: FormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {children}

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
