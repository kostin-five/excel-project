const CODES = {
  A: 65,
  Z: 90,
};

function createCell(_, ind) {
  return `
    <div class="cell" data-index=${ind} contenteditable></div>
    `;
}

function createCol(col, ind) {
  return `<div class="column" data-type="resizable" data-index="${ind}">${col}
  <div class="col-resize" data-resize="col" ></div>
  </div>`;
}

function createRow(index, content) {
  const resizer = index
    ? '<div class="row-resize" data-resize="row"></div>'
    : "";
  return `
    <div class="row" data-type="resizable" >
        <div class="row-info" >
        ${index ? index : ""}
        ${resizer}
        </div>
        <div class="row-data">${content}</div>
    </div>`;
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index);
}

export function createTable(rowsCount = 20) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
    .fill("")
    .map(toChar)
    .map(createCol)
    .join("");

  const cells = new Array(colsCount).fill("").map(createCell).join("");

  rows.push(createRow(null, cols));

  for (let i = 0; i < rowsCount; i++) {
    rows.push(createRow(i + 1, cells));
  }

  return rows.join("");
}
