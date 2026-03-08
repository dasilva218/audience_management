import { SignOut } from "@/lib/action";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <p className="text-xs font-medium">Administration - E-Audience Gabon</p>
          <p className="text-xs text-primary-foreground/80">
            {/* {user.ministryName} */}
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            {/* {user.name.charAt(0)} */}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              {/* {user.name} */}
            </span>
            <span className="text-xs text-muted-foreground">
              {/* {user.email} */}
            </span>
          </div>
        </div>
        <Button variant="ghost" onClick={() => SignOut()} size="sm" className="text-muted-foreground">
          <LogOut className="mr-2 h-4 w-4" />
          Deconnexion
        </Button>
      </div>
    </header>
  );
}