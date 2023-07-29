class Project {
  constructor(name) {
    this.id = null;
    this.name = name;
    this.todos = [];
  }
}

class Todo {
  constructor(title, description, dueDate, priority, checked = 0) {
    this.id = null;
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.checked = checked;
  }
}

export { Todo, Project };
