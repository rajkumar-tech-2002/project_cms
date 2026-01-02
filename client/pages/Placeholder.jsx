import MainLayout from "@/components/MainLayout.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Placeholder({
  title,
  description,
  icon: Icon,
}) {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Link to="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <Icon className="w-12 h-12 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground mb-8">{description}</p>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This page is being built. Continue interacting with the assistant to
                fill in this page's content.
              </p>
              <Link to="/">
                <Button>Return to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
