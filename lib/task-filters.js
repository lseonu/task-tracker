function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export function filterTasks(tasks, filters) {
  return tasks.filter((task) => {
    const query = normalize(filters.query);
    if (query) {
      const haystack = [
        task.title,
        task.source,
        task.type,
        task.category,
        task.notes,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    if (filters.status !== "all" && task.status !== filters.status) {
      return false;
    }

    if (filters.source !== "all" && task.source !== filters.source) {
      return false;
    }

    if (filters.agent === "human" && task.agentSuitability) {
      return false;
    }

    if (filters.agent === "bot" && !task.agentSuitability) {
      return false;
    }

    if (filters.type !== "all" && task.type !== filters.type) {
      return false;
    }

    if (filters.category && !normalize(task.category).includes(normalize(filters.category))) {
      return false;
    }

    if (filters.priority !== "all" && String(task.priority) !== String(filters.priority)) {
      return false;
    }

    if (filters.effort !== "all" && task.effort !== filters.effort) {
      return false;
    }

    if (filters.staleness === "fresh" && task.ageDays > 3) {
      return false;
    }

    if (filters.staleness === "stale" && task.ageDays <= 3) {
      return false;
    }

    return true;
  });
}

function compareNullableNumber(a, b, direction = 1) {
  const left = Number.isFinite(a) ? a : Number.POSITIVE_INFINITY;
  const right = Number.isFinite(b) ? b : Number.POSITIVE_INFINITY;
  if (left === right) {
    return 0;
  }
  return left < right ? -1 * direction : 1 * direction;
}

export function sortTasks(tasks, sortMode) {
  const list = [...tasks];
  switch (sortMode) {
    case "manual":
      return list.sort((a, b) => a.order - b.order);
    case "priority":
      return list.sort((a, b) => b.priority - a.priority || b.ageDays - a.ageDays || a.order - b.order);
    case "age":
      return list.sort((a, b) => b.ageDays - a.ageDays || b.priority - a.priority || a.order - b.order);
    case "due":
      return list.sort((a, b) => compareNullableNumber(a.dueInDays, b.dueInDays, 1) || b.priority - a.priority || a.order - b.order);
    case "effort":
      return list.sort((a, b) => {
        const weight = { small: 1, medium: 2, large: 3 };
        return (weight[a.effort] - weight[b.effort]) || b.priority - a.priority || a.order - b.order;
      });
    case "title":
      return list.sort((a, b) => a.title.localeCompare(b.title) || a.order - b.order);
    case "ranking":
    default:
      return list;
  }
}

export function getCategories(tasks) {
  return Array.from(new Set(tasks.map((task) => task.category).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );
}
