import { Todo } from "../types/Todo";
import { FilteringType } from "../types/filteringType";

export const filteringTodos = (todos: Todo[], typeOfFiltering: string) => {
  const filteredTodos = [...todos].filter(todo => {
    if (typeOfFiltering) {
      switch (typeOfFiltering) {
        case FilteringType.All:
          return todos;
        case FilteringType.Active:
          return !todo.completed;
        case FilteringType.Completed:
          return todo.completed;
        default:
          return todos;
      }
    }

    return todo;
  });

  return filteredTodos;
}
