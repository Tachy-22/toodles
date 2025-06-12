'use client'
import { AppDispatch } from "@/application/state/store";
import { setTodos } from "@/application/state/todoSlice";
import { Todo } from "@/domain/entities/Todo";
import React, { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";

const TodoDataProvider = ({
  children,
  todos,
}: {
  children: ReactNode;
  todos: Todo[];
}) => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch todos when the component mounts
  useEffect(() => {
    if (todos) {
      dispatch(setTodos(todos));
    }
  }, [dispatch, todos]);

  return <>{children}</>;
};

export default TodoDataProvider;
