import { defaultStyles } from "../../constants";
import { parse } from "../../core/parse";
import { toInlineStyles } from "../../core/utils";

const CODES = {
  A: 65,
  Z: 90,
};

function createCell(state, row) {
  return function (_, col) {
    const id = `${row}:${col}`;
    const data = state.dataState[id];
    const styles = toInlineStyles({
      ...defaultStyles,
      ...state.stylesState[id],
    });
    return `
    <div class="cell" 
    style="${styles}; width: ${state.colState[col] || "120"}px" 
    contenteditable data-type="cell"
    data-col="${col}"
    data-value="${data || ""}"
    data-id="${id}">${parse(data) || ""}</div>
    `;
  };
}

function createCol(col, ind, width = "120") {
  return `<div class="column" data-type="resizable" style="width:${width}px" data-col="${ind}">${col}
              <div class="col-resize" data-resize="col"></div>
          </div>`;
}

function createRow(state, index, content) {
  const resizer = index
    ? '<div class="row-resize" data-resize="row"></div>'
    : "";
  return `
    <div class="row" style="height: ${
      state[index] || "24"
    }px" data-type="resizable" data-row="${index ? index : ""}" >
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

export function createTable(rowsCount = 20, state = {}) {
  const colsCount = CODES.Z - CODES.A + 1;
  const rows = [];

  const colState = state.colState || {};
  const rowState = state.rowState || {};

  const cols = new Array(colsCount)
    .fill("")
    .map(toChar)
    .map((el, ind) => createCol(el, ind, colState[ind]))
    .join("");

  rows.push(createRow(rowState, null, cols));

  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
      .fill("")
      .map(createCell(state, row))
      .join("");

    rows.push(createRow(rowState, row + 1, cells));
  }

  return rows.join("");
}
