import cn from 'classnames';
import React from 'react';
import { FilteringType } from '../types/filteringType';
import { Todo } from '../types/Todo';

type Props = {
  setTypeOfFiltering: (type: string) => void;
  typeOfFiltering: string;
  todos: Todo[]
  deleteTodo: (id: number[]) => void,
};

export const Footer: React.FC<Props> = ({
  setTypeOfFiltering,
  typeOfFiltering,
  todos,
  deleteTodo,
}) => {
  const leftTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  function getCompletedId() {
    return completedTodos.map(todo => todo.id);
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${leftTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: typeOfFiltering === FilteringType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setTypeOfFiltering(FilteringType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: typeOfFiltering === FilteringType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setTypeOfFiltering(FilteringType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: typeOfFiltering === FilteringType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setTypeOfFiltering(FilteringType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteTodo(getCompletedId())}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
