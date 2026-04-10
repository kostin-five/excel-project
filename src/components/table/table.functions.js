export function shouldResize(event) {
  return event.target.dataset.resize;
}

export function isCell(event) {
  return event.target.dataset.type === "cell";
}

export function matrix($root, target, current) {
  const selected = [];
  const colMax = Math.max(current[1], target[1]);
  const colMin = Math.min(current[1], target[1]);
  const rowMax = Math.max(current[0], target[0]);
  const rowMin = Math.min(current[0], target[0]);
  for (let i = colMin; i <= colMax; i++) {
    for (let j = rowMin; j <= rowMax; j++) {
      selected.push($root.find(`[data-id="${j}:${i}"]`));
    }
  }
  return selected;
}

export function nextSelector(key, { row, col }) {
  const MIN_VALUE = 0;
  switch (key) {
    case "Enter":
    case "ArrowDown":
      row++;
      break;
    case "Tab":
    case "ArrowRight":
      col++;
      break;
    case "ArrowLeft":
      col = (col - 1) < MIN_VALUE ? MIN_VALUE : col - 1;
      break;
    case "ArrowUp":
      row = (row - 1) < MIN_VALUE ? MIN_VALUE : row - 1;
      break;
  }

  return `[data-id="${row}:${col}"]`;
}
