class Project {
  constructor(name) {
    this.name = name;
    this.todos = [];
  }
}

class Todo {
  constructor(title, description, dueDate, priority, checked = false) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.checked = checked;
  }
}

export { Todo, Project };
