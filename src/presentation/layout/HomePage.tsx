"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/application/state/store";
import { Button } from "@/presentation/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4.5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4.5rem)] bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to Toodles
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          A clean architecture todo app built with Next.js, TypeScript, and
          Firebase
        </p>

        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/login">
              <Button size="lg">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        )}

{isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href={`/user/${user?.uid}/todos`}>
              <Button size="lg">My Todos</Button>
            </Link>
          
          </div>
        )}
        
        

      </div>
    </div>
  );
}
