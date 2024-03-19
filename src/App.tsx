/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/header';
import { TodoList } from './components/todoList';
import { Footer } from './components/footer';
import { ErrorNotification } from './components/errorNotification';
import { Todo } from './types/Todo';
import * as todoApi from './api/todos';
import { FilteringType } from './types/filteringType';
import { USER_ID } from './utils/User_Id';
import { filteringTodos } from './services/filteredTodos';
import { loadingTodos } from './services/loadTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [typeOfFiltering, setTypeOfFiltering]
    = useState<string>(FilteringType.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoLoadingId, setTodoLoadingId] = useState<number[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const filteredTodos = filteringTodos(todos, typeOfFiltering);

  const errorDeletion = useCallback(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const loadTodos = loadingTodos(setTodos, setErrorMessage, errorDeletion);
  let isToggleAll = false;

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  async function addTodo(
    {
      title, completed, id, userId,
    }: Todo,
  ): Promise<{ isError: boolean } | undefined> {
    let isError = false;

    setIsDisabledInput(true);
    setTempTodo({
      title, completed, id: 0, userId,
    });

    try {
      const createTodo = await todoApi.createTodo(
        {
          title, completed, id, userId,
        },
      );

      setTodos(currentTodos => [...currentTodos, createTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      errorDeletion();
      isError = true;
    } finally {
      setIsDisabledInput(false);
      setTempTodo(null);
    }

    if (isError) {
      return { isError };
    }

    return undefined;
  }

  async function deleteTodo(id: number[]) {
    setTodoLoadingId(id);

    await Promise.all(id.map(idCompleted => (
      todoApi.deleteTodos(idCompleted)
        .then(() => {
          setTodos(
            currentList => currentList.filter(
              todo => todo.id !== idCompleted,
            ),
          )
        }).finally(() => setTodoLoadingId(
          (currentIds) => currentIds.filter(
            currentId => currentId !== idCompleted,
          ),
        ))
    ))).catch(() => {
      setErrorMessage('Unable to delete a todo');
      errorDeletion();
    });
  }

  async function updatePost(
    updetedPost: Todo,
  ): Promise<{ isError: boolean } | undefined> {
    if (!isToggleAll) {
      setTodoLoadingId([updetedPost.id]);
    }

    setIsDisabledInput(true);
    let isError = false;

    try {
      const updateTodo = await todoApi.updateTodo(updetedPost);

      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(
          todo => todo.id === updetedPost.id,
        );

        newTodos.splice(index, 1, updateTodo);

        return newTodos;
      });
    } catch (error) {
      isError = true;
      throw error;
    } finally {
      setTodoLoadingId([]);
      setIsDisabledInput(false);
      isToggleAll = false;
    }

    if (isError) {
      return { isError };
    }

    return undefined;
  }

  async function toggleAll() {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(todo => (isAllCompleted
      ? todo.completed
      : !todo.completed
    ));

    setTodoLoadingId(todosToUpdate.map(todo => todo.id));
    isToggleAll = true;

    await Promise.all(todosToUpdate.map(todo => (
      updatePost({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setErrorMessage={setErrorMessage}
          // eslint-disable-next-line
          onSubmit={addTodo}
          setIsDisabledInput={setIsDisabledInput}
          isDisabledInput={isDisabledInput}
          errorDeletion={errorDeletion}
          // eslint-disable-next-line react/jsx-no-bind
          onToggleAll={toggleAll}
          // eslint-disable-next-line react/jsx-no-bind
          onUpdatePost={updatePost}
        />

        {todos.length > 0
          && (
            <TodoList
              todos={filteredTodos}
              // eslint-disable-next-line
              onDeleteTodo={deleteTodo}
              tempTodo={tempTodo}
              todoLoadingId={todoLoadingId}
              // eslint-disable-next-line
              onUpdatePost={updatePost}
              setSelectedTodo={setSelectedTodo}
              selectedTodo={selectedTodo}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              errorDeletion={errorDeletion}
            />
          )}

        {todos.length > 0
          && (
            <Footer
              setTypeOfFiltering={setTypeOfFiltering}
              typeOfFiltering={typeOfFiltering}
              todos={todos}
              // eslint-disable-next-line
              deleteTodo={deleteTodo}
            />
          )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
