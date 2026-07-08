import { createSeededTasks } from "../lib/seeded-tasks.js";
import { filterTasks, getCategories, sortTasks } from "../lib/task-filters.js";
import { rankBotCandidates, rankHumanTasks } from "../lib/recommendation.js";

const state = {
  tasks: createSeededTasks(),
  filters: {
    query: "",
    status: "active",
    source: "all",
    agent: "all",
    type: "all",
    category: "",
    priority: "all",
    effort: "all",
    staleness: "all",
    sort: "ranking",
  },
  selectedId: null,
  undoSnapshot: null,
  nextId: 7,
};

const el = {
  queueList: document.querySelector("#queue-list"),
  queueEmpty: document.querySelector("#queue-empty"),
  nextUp: document.querySelector("#next-up-body"),
  botBody: document.querySelector("#bot-body"),
  detailBody: document.querySelector("#detail-body"),
  detailForm: document.querySelector("#detail-form"),
  drawer: document.querySelector("#drawer"),
  drawerTitle: document.querySelector("#drawer-title"),
  toast: document.querySelector("#toast"),
  taskForm: document.querySelector("#task-form"),
};

const filterInputs = {
  query: document.querySelector("#filter-query"),
  status: document.querySelector("#filter-status"),
  source: document.querySelector("#filter-source"),
  type: document.querySelector("#filter-type"),
  category: document.querySelector("#filter-category"),
  priority: document.querySelector("#filter-priority"),
  effort: document.querySelector("#filter-effort"),
  staleness: document.querySelector("#filter-staleness"),
  agent: document.querySelector("#filter-agent"),
  sort: document.querySelector("#filter-sort"),
};

applyDemoScenario();

document.querySelector("#reset-filters").addEventListener("click", () => {
  state.filters = {
    ...state.filters,
    query: "",
    status: "active",
    source: "all",
    agent: "all",
    type: "all",
    category: "",
    priority: "all",
    effort: "all",
    staleness: "all",
    sort: "ranking",
  };
  syncFilters();
  render();
});

Object.entries(filterInputs).forEach(([key, input]) => {
  input.addEventListener("input", () => {
    state.filters[key] = input.value;
    render();
  });
});

document.querySelector("details.composer-advanced").addEventListener("toggle", (event) => {
  if (event.target.open) {
    event.target.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});

el.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(el.taskForm);
  const task = {
    id: `t-${state.nextId++}`,
    title: String(formData.get("title") || "").trim(),
    source: String(formData.get("source") || "manual"),
    type: String(formData.get("type") || "task"),
    category: String(formData.get("category") || "manual"),
    status: "active",
    priority: Number(formData.get("priority") || 4),
    ageDays: 0,
    dueInDays: parseOptionalNumber(formData.get("dueInDays")),
    effort: String(formData.get("effort") || "medium"),
    unblocksOthers: formData.get("unblocksOthers") === "on",
    recentlyWorked: formData.get("recentlyWorked") === "on",
    agentSuitability: formData.get("agentSuitability") === "on",
    notes: String(formData.get("notes") || "").trim(),
    order: state.tasks.length + 1,
  };

  if (!task.title) {
    return;
  }

  state.tasks = [task, ...state.tasks.map((item, index) => ({ ...item, order: index + 2 }))];
  el.taskForm.reset();
  el.taskForm.querySelector("details").open = false;
  state.filters.status = "active";
  syncFilters();
  render();
  flashToast(`Added ${task.title}`);
});

el.drawer.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-drawer]") || event.target === el.drawer.querySelector(".drawer-backdrop")) {
    closeDrawer();
  }
});

render();
if (new URLSearchParams(window.location.search).get("shot") === "done") {
  flashToast("Completed Renew Tiny Tools submission checklist", true);
}

function parseOptionalNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function applyDemoScenario() {
  const scenario = new URLSearchParams(window.location.search).get("shot");
  if (!scenario) {
    return;
  }

  const manualTask = {
    id: "shot-manual-task",
    title: "Renew Tiny Tools submission checklist",
    source: "housekeeping",
    type: "chore",
    category: "submission",
    status: "active",
    priority: 4,
    ageDays: 0,
    dueInDays: 1,
    effort: "small",
    unblocksOthers: true,
    recentlyWorked: true,
    agentSuitability: false,
    notes: "Manually captured work that was not tracked in GitHub, GitLab, or Linear.",
    order: 0,
  };

  if (["manual", "filtered", "detail", "done"].includes(scenario)) {
    state.tasks = [manualTask, ...state.tasks.map((task, index) => ({ ...task, order: index + 1 }))];
    state.nextId = 8;
  }

  if (scenario === "filtered") {
    state.filters.source = "housekeeping";
    state.filters.sort = "priority";
  }

  if (scenario === "detail") {
    state.selectedId = manualTask.id;
  }

  if (scenario === "bot") {
    state.filters.agent = "bot";
  }

  if (scenario === "done") {
    state.tasks = state.tasks.map((task) =>
      task.id === manualTask.id ? { ...task, status: "done" } : task
    );
    state.filters.status = "all";
    state.undoSnapshot = manualTask;
  }
}

function syncFilters() {
  Object.entries(filterInputs).forEach(([key, input]) => {
    input.value = state.filters[key];
  });
}

function getVisibleTasks() {
  const filtered = filterTasks(state.tasks, state.filters);
  return sortTasks(filtered, state.filters.sort);
}

function getTaskById(id) {
  return state.tasks.find((task) => task.id === id);
}

function render() {
  const categories = getCategories(state.tasks);
  populateCategoryFilter(categories);
  syncFilters();
  const visibleTasks = getVisibleTasks();
  renderQueue(visibleTasks);
  renderNextUp(visibleTasks);
  renderBotCandidates(visibleTasks);
  renderDetail();
}

function renderQueue(visibleTasks) {
  el.queueList.innerHTML = "";
  el.queueEmpty.hidden = visibleTasks.length > 0;

  if (visibleTasks.length === 0) {
    return;
  }

  visibleTasks.forEach((task) => {
    const row = document.createElement("article");
    row.className = `task-row ${task.status === "done" ? "done" : ""}`;
    row.setAttribute("role", "listitem");
    row.dataset.id = task.id;

    row.innerHTML = `
      <div class="task-row-main">
        <div class="task-row-title ${task.status === "done" ? "done" : ""}">
          <h3>${escapeHtml(task.title)}</h3>
          ${task.status === "done" ? '<span class="chip chip--warm">Done</span>' : ""}
          ${task.agentSuitability ? '<span class="chip chip--accent">Bot candidate</span>' : ""}
        </div>
        <div class="task-meta">
          <span class="chip">${labelFor(task.source)}</span>
          <span class="chip">${labelFor(task.type)}</span>
          <span class="chip">${escapeHtml(task.category)}</span>
          <span class="chip">Priority ${task.priority}</span>
          <span class="chip">${task.effort}</span>
          ${task.unblocksOthers ? '<span class="chip chip--accent">Unblocks others</span>' : ""}
          ${task.recentlyWorked ? '<span class="chip chip--warm">Recent</span>' : ""}
          ${task.dueInDays == null ? "" : `<span class="chip">${task.dueInDays}d due</span>`}
        </div>
        <p class="muted">${escapeHtml(task.notes || "No extra notes.")}</p>
      </div>
      <div class="task-row-actions">
        <button class="row-action" data-action="open">Open</button>
        ${task.status === "active" ? `<button class="row-action" data-action="complete">Done</button>` : ""}
        ${state.filters.sort === "manual" ? `
          <button class="tiny-button" data-action="up">↑</button>
          <button class="tiny-button" data-action="down">↓</button>
        ` : ""}
      </div>
    `;

    row.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      if (actionButton) {
        const action = actionButton.dataset.action;
        if (action === "open") {
          openDrawer(task.id);
        } else if (action === "complete") {
          markDone(task.id);
        } else if (action === "up") {
          moveTask(task.id, -1);
        } else if (action === "down") {
          moveTask(task.id, 1);
        }
        return;
      }
      if (event.target.closest("button")) {
        return;
      }
      openDrawer(task.id);
    });

    el.queueList.appendChild(row);
  });
}

function renderNextUp(visibleTasks) {
  const ranking = rankHumanTasks(visibleTasks);
  if (ranking.length === 0) {
    el.nextUp.innerHTML = `
      <div class="recommendation-card">
        <p class="muted">No active tasks in this slice.</p>
        <p class="recommendation-explainer">Change the filters or add a task to populate the ranking.</p>
      </div>
    `;
    return;
  }

  el.nextUp.innerHTML = ranking
    .map((item, index) => {
      const task = item.task;
      const rankLabel = index === 0 ? "Primary recommendation" : `Rank ${index + 1}`;
      const cardClass = index === 0 ? "recommendation-card primary" : "recommendation-card";
      return `
        <article class="${cardClass}">
          <div class="recommendation-rank">${rankLabel}</div>
          <div class="recommendation-title">
            <h3>${escapeHtml(task.title)}</h3>
            <span class="chip">${labelFor(task.source)}</span>
            <span class="chip">${labelFor(task.type)}</span>
          </div>
          <div class="ranking-chips">
            ${item.chips.map((chip) => `<span class="chip chip--accent">${escapeHtml(chip)}</span>`).join("")}
          </div>
          <p class="recommendation-explainer">${escapeHtml(item.explanation)}</p>
        </article>
      `;
    })
    .join("");
}

function renderBotCandidates(visibleTasks) {
  const ranking = rankBotCandidates(visibleTasks);
  if (ranking.length === 0) {
    el.botBody.innerHTML = `
      <div class="recommendation-card">
        <p class="muted">No bot candidates in the current slice.</p>
      </div>
    `;
    return;
  }

  el.botBody.innerHTML = ranking
    .map((item) => {
      const task = item.task;
      return `
        <article class="recommendation-card">
          <div class="recommendation-title">
            <h3>${escapeHtml(task.title)}</h3>
            <span class="chip chip--warm">Agent suitable</span>
          </div>
          <div class="ranking-chips">
            ${item.chips.map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("")}
          </div>
          <p class="recommendation-explainer">${escapeHtml(item.explanation)}</p>
        </article>
      `;
    })
    .join("");
}

function renderDetail() {
  const task = state.selectedId ? getTaskById(state.selectedId) : null;
  if (!task) {
    el.detailBody.innerHTML = `<div class="detail-placeholder">Select a task to edit advanced fields or mark it done.</div>`;
    el.drawer.hidden = true;
    return;
  }

  el.detailBody.innerHTML = `
    <div class="detail-card">
      <div class="task-row-title">
        <h3>${escapeHtml(task.title)}</h3>
        ${task.status === "done" ? '<span class="chip chip--warm">Done</span>' : ""}
        ${task.agentSuitability ? '<span class="chip chip--accent">Bot candidate</span>' : ""}
      </div>
      <div class="task-meta">
        <span class="chip">${labelFor(task.source)}</span>
        <span class="chip">${labelFor(task.type)}</span>
        <span class="chip">${escapeHtml(task.category)}</span>
        <span class="chip">Priority ${task.priority}</span>
      </div>
      <p class="muted">${escapeHtml(task.notes || "No extra notes.")}</p>
    </div>
  `;

  el.drawer.hidden = false;
  el.drawerTitle.textContent = task.title;
  el.detailForm.innerHTML = `
    <div class="detail-grid">
      <label class="full">
        <span>Title</span>
        <input name="title" value="${escapeAttr(task.title)}" />
      </label>
      <label>
        <span>Source</span>
        <select name="source">
          ${["manual", "github", "gitlab", "linear", "housekeeping"].map((value) => `<option value="${value}" ${task.source === value ? "selected" : ""}>${labelFor(value)}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Type</span>
        <select name="type">
          ${["issue", "review", "task", "chore"].map((value) => `<option value="${value}" ${task.type === value ? "selected" : ""}>${labelFor(value)}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Category</span>
        <input name="category" value="${escapeAttr(task.category)}" />
      </label>
      <label>
        <span>Status</span>
        <select name="status">
          <option value="active" ${task.status === "active" ? "selected" : ""}>Active</option>
          <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
        </select>
      </label>
      <label>
        <span>Priority</span>
        <select name="priority">
          ${[5, 4, 3, 2, 1].map((value) => `<option value="${value}" ${task.priority === value ? "selected" : ""}>${value}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Effort</span>
        <select name="effort">
          ${["small", "medium", "large"].map((value) => `<option value="${value}" ${task.effort === value ? "selected" : ""}>${labelFor(value)}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Due in days</span>
        <input name="dueInDays" type="number" min="0" value="${task.dueInDays == null ? "" : task.dueInDays}" />
      </label>
      <label class="full">
        <span>Notes</span>
        <textarea name="notes">${escapeHtml(task.notes || "")}</textarea>
      </label>
      <label class="check">
        <input name="recentlyWorked" type="checkbox" ${task.recentlyWorked ? "checked" : ""} />
        <span>Recently worked</span>
      </label>
      <label class="check">
        <input name="unblocksOthers" type="checkbox" ${task.unblocksOthers ? "checked" : ""} />
        <span>Unblocks others</span>
      </label>
      <label class="check">
        <input name="agentSuitability" type="checkbox" ${task.agentSuitability ? "checked" : ""} />
        <span>Bot candidate</span>
      </label>
    </div>
    <div class="detail-actions">
      <button class="primary" type="submit">Save changes</button>
      ${task.status === "active" ? `<button class="secondary" type="button" data-complete-task>Mark done</button>` : `<button class="secondary" type="button" data-complete-task>Restore to active</button>`}
      <button class="secondary" type="button" data-close-drawer>Close</button>
    </div>
  `;

  el.detailForm.onsubmit = (event) => {
    event.preventDefault();
    saveTask(task.id, new FormData(el.detailForm));
  };
  el.detailForm.querySelector("[data-complete-task]").addEventListener("click", () => {
    if (task.status === "active") {
      markDone(task.id);
    } else {
      restoreTask(task.id);
    }
  });
  el.detailForm.querySelector("[data-close-drawer]").addEventListener("click", closeDrawer);
}

function openDrawer(id) {
  state.selectedId = id;
  render();
}

function closeDrawer() {
  state.selectedId = null;
  render();
}

function saveTask(id, formData) {
  const task = getTaskById(id);
  if (!task) return;
  const updated = {
    ...task,
    title: String(formData.get("title") || task.title).trim(),
    source: String(formData.get("source") || task.source),
    type: String(formData.get("type") || task.type),
    category: String(formData.get("category") || task.category).trim(),
    status: String(formData.get("status") || task.status),
    priority: Number(formData.get("priority") || task.priority),
    effort: String(formData.get("effort") || task.effort),
    dueInDays: parseOptionalNumber(formData.get("dueInDays")),
    notes: String(formData.get("notes") || "").trim(),
    recentlyWorked: formData.get("recentlyWorked") === "on",
    unblocksOthers: formData.get("unblocksOthers") === "on",
    agentSuitability: formData.get("agentSuitability") === "on",
  };

  state.tasks = state.tasks.map((item) => (item.id === id ? updated : item));
  render();
  flashToast(`Saved ${updated.title}`);
}

function markDone(id) {
  const task = getTaskById(id);
  if (!task) return;
  state.undoSnapshot = { ...task };
  state.tasks = state.tasks.map((item) =>
    item.id === id ? { ...item, status: "done" } : item
  );
  render();
  flashToast(`Completed ${task.title}`, true);
}

function restoreTask(id) {
  state.tasks = state.tasks.map((item) =>
    item.id === id ? { ...item, status: "active" } : item
  );
  render();
  flashToast("Restored to active");
}

function moveTask(id, direction) {
  const activeOrder = [...state.tasks].sort((a, b) => a.order - b.order);
  const index = activeOrder.findIndex((task) => task.id === id);
  const neighborIndex = index + direction;
  if (index < 0 || neighborIndex < 0 || neighborIndex >= activeOrder.length) {
    return;
  }
  const current = activeOrder[index];
  const neighbor = activeOrder[neighborIndex];
  const swapped = activeOrder.map((task) => {
    if (task.id === current.id) return { ...task, order: neighbor.order };
    if (task.id === neighbor.id) return { ...task, order: current.order };
    return task;
  });
  state.tasks = swapped;
  render();
}

function flashToast(message, allowUndo = false) {
  el.toast.hidden = false;
  el.toast.innerHTML = `
    <div class="toast-row">
      <strong>${escapeHtml(message)}</strong>
      <button type="button" data-close-toast>×</button>
    </div>
    ${allowUndo && state.undoSnapshot ? `<div class="toast-row"><span class="muted-small">Task moved to done. Undo is available.</span><button type="button" data-undo>Undo</button></div>` : ""}
  `;

  const timeout = window.setTimeout(() => {
    el.toast.hidden = true;
  }, 2600);

  el.toast.querySelector("[data-close-toast]").onclick = () => {
    clearTimeout(timeout);
    el.toast.hidden = true;
  };

  const undo = el.toast.querySelector("[data-undo]");
  if (undo) {
    undo.onclick = () => {
      clearTimeout(timeout);
      if (state.undoSnapshot) {
        state.tasks = state.tasks.map((task) =>
          task.id === state.undoSnapshot.id ? { ...state.undoSnapshot, status: "active" } : task
        );
        state.undoSnapshot = null;
        render();
      }
      el.toast.hidden = true;
    };
  }
}

function labelFor(value) {
  return String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function populateCategoryFilter(categories) {
  const input = filterInputs.category;
  if (input.tagName === "INPUT") {
    input.placeholder = categories.length ? `Search ${categories.length} categories` : "Search category";
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
