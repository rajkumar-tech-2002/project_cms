import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg " +
            "data-[type=success]:bg-emerald-50 data-[type=success]:text-emerald-800 data-[type=success]:border-emerald-500 " +
            "data-[type=error]:bg-red-50 data-[type=error]:text-red-800 data-[type=error]:border-red-500 " +
            "data-[type=warning]:bg-yellow-50 data-[type=warning]:text-yellow-800 data-[type=warning]:border-yellow-500 " +
            "data-[type=info]:bg-blue-50 data-[type=info]:text-blue-800 data-[type=info]:border-blue-500",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
        error: <XCircle className="w-5 h-5 text-red-600" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
        info: <Info className="w-5 h-5 text-blue-600" />,
      }}
      {...props}
    />
  );
};

export { Toaster };
