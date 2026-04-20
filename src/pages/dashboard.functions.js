import { storage } from "../core/utils";

function toHTML(key) {
  const model = storage(key);
  return `<li class="db__record">
            <a href="#excel/${key.split(":")[1]}">${model.title}</a>
            <strong>${new Date(model.openedDate).toLocaleDateString()}
                     ${new Date(model.openedDate).toLocaleTimeString()}</strong>
          </li>`;
}

export function getAllKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.includes("excel")) {
      continue;
    }
    keys.push(key);
  }
  return keys;
}

export function createRecordsTable() {
  const keys = getAllKeys();
  if (!keys.length) {
    return `<p>Вы пока не создали ни одной таблицы</p>`;
  }
  return `<div class="db__list-header">
            <span>Title</span>
            <span>Date</span>
          </div>
        </div>

        <ul class="db__list">
          ${keys.map((key) => toHTML(key)).join("")}
        </ul>`;
}
