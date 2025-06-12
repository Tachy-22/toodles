"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/application/state/store";
import { logoutUser } from "@/application/use-cases/auth/logoutUser";
import { Button } from "@/presentation/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { ChevronDown,  LogOut, Settings, User } from "lucide-react";
import { useToast } from "@/presentation/components/ui/use-toast";

export const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      router.push("/login");
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to log out",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & App Name */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Toodles</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <span>Home</span>
            </Link>
            {user && (
              <Link
                href={`/user/${user.uid}/todos`}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
              >
                <span>Todos</span>
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{user.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push(`/user/${user.uid}/settings`)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
