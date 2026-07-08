function addChip(chips, seen, value) {
  if (value && !seen.has(value)) {
    chips.push(value);
    seen.add(value);
  }
}

function isDueSoon(task) {
  return Number.isFinite(task.dueInDays) && task.dueInDays <= 2;
}

function buildExplanation(task, chips) {
  if (chips.includes("Unblocks others")) {
    return "This is first because it clears a blocker for someone else before the queue grows.";
  }

  if (chips.includes("Momentum")) {
    if (chips.includes("Due soon")) {
      return "This keeps the current thread moving and avoids slipping past the deadline.";
    }
    return "This stays close to what you were already working on, so the context cost stays low.";
  }

  if (chips.includes("Due soon")) {
    return "This deserves attention because the deadline is closer than most of the other tasks.";
  }

  return "This is the strongest mix of priority, age, and effort among the visible tasks.";
}

function scoreTask(task) {
  const chips = [];
  const seen = new Set();
  let score = 0;

  if (task.unblocksOthers) {
    score += 120;
    addChip(chips, seen, "Unblocks others");
  }

  if (task.type === "review") {
    score += 55;
    addChip(chips, seen, "PR review");
  }

  if (task.recentlyWorked) {
    score += 50;
    addChip(chips, seen, "Momentum");
  }

  if (task.priority >= 4) {
    score += 30 + task.priority * 2;
    addChip(chips, seen, `Priority ${task.priority}`);
  }

  if (task.ageDays >= 5) {
    score += 18;
    addChip(chips, seen, `Aging ${task.ageDays}d`);
  }

  if (isDueSoon(task)) {
    score += 36;
    addChip(chips, seen, "Due soon");
  }

  if (task.effort === "small") {
    score += 8;
    addChip(chips, seen, "Small effort");
  }

  if (task.agentSuitability) {
    score -= 18;
    addChip(chips, seen, "Bot candidate");
  }

  if (task.source === "housekeeping") {
    score += 4;
    addChip(chips, seen, "Housekeeping");
  }

  return {
    task,
    score,
    chips: chips.slice(0, 3),
    explanation: buildExplanation(task, chips),
  };
}

export function rankHumanTasks(tasks) {
  const active = tasks.filter((task) => task.status === "active");
  const humanPool = active.filter((task) => !task.agentSuitability);
  const pool = humanPool.length >= 3 ? humanPool : active;
  return pool.map(scoreTask).sort((a, b) => b.score - a.score || b.task.priority - a.task.priority || a.task.order - b.task.order).slice(0, 3);
}

export function rankBotCandidates(tasks) {
  return tasks
    .filter((task) => task.status === "active" && task.agentSuitability)
    .map((task) => {
      const chips = [];
      if (task.effort === "small") chips.push("Small effort");
      if (task.recentlyWorked) chips.push("Recent context");
      if (task.priority >= 4) chips.push(`Priority ${task.priority}`);
      if (task.dueInDays != null && task.dueInDays <= 2) chips.push("Due soon");
      const explanation =
        task.effort === "small"
          ? "Small enough to hand off to a coding agent in one pass."
          : "Scoped closely enough that a coding agent could tackle it next.";
      return {
        task,
        score: (task.effort === "small" ? 40 : 20) + (task.priority * 4) + (task.recentlyWorked ? 8 : 0),
        chips: chips.slice(0, 3),
        explanation,
      };
    })
    .sort((a, b) => b.score - a.score || b.task.priority - a.task.priority || a.task.order - b.task.order);
}
