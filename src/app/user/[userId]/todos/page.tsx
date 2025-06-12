import { getTodosAction } from "@/app/actions/todoActions";
import TodosPage from "@/presentation/layout/TodoPage";
import TodoDataProvider from "@/presentation/providers/TodoDataProvider";
import React from "react";

const page = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params;
  const todos = await getTodosAction(userId);

  console.log({});
  return (
    <TodoDataProvider todos={todos}>
      <TodosPage />
    </TodoDataProvider>
  );
};

export default page;
export const dynamic = "force-dynamic"; // Force dynamic rendering for this page
