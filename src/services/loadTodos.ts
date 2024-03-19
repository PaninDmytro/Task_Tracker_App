import { useCallback } from "react";
import * as todoApi from '../api/todos';
import { Todo } from '../types/Todo';

type SetTodos = (todos: Todo[]) => void;
type SetErrorMessage = (error: string) => void;
type ErrorDeletion = () => void;

export const loadingTodos = (
  setTodos: SetTodos,
  setErrorMessage: SetErrorMessage,
  errorDeletion: ErrorDeletion
) => {
  const loadTodos = useCallback(async () => {
    try {
      const todosData = await todoApi.getTodos();

      setTodos(todosData);
    } catch (error) {
      setErrorMessage('Unable to load todos');
      errorDeletion();
    }
  }, [setTodos, setErrorMessage, errorDeletion]);

  return loadTodos;
}
