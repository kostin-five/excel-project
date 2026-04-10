import { ExcelComponent } from "../../core/ExcelComponent";
import { createTable } from "./table.template";
import { $ } from "./../../core/dom";
import { resizeHandler } from "./table.resize";
import { isCell, shouldResize, matrix, nextSelector } from "./table.functions";
import { TableSelection } from "./TableSelection";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root, options) {
    super($root, {
      name: "Table",
      listeners: ["mousedown", "keydown", "input"],
      ...options,
    });
  }

  prepare() {
    this.selection = new TableSelection();
  }

  toHTML() {
    return createTable(30);
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit("table:select", $cell);
  }

  init() {
    super.init();

    this.selectCell(this.$root.find('[data-id="0:0"]'));

    this.$on("formula:input", (text) => {
      this.selection.current.text(text);
    });

    this.$on("formula:done", () => {
      this.selection.current.focus();
    });
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this.$root, event);
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        const current = this.selection.current.data.id.split(":").map(Number);
        const target = $target.data.id.split(":").map(Number);

        const selected = matrix(this.$root, target, current);
        this.selection.selectGroup(selected);
      } else {
        this.selectCell($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      "Enter",
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "ArrowRight",
      "ArrowLeft",
    ];
    const { key } = event;
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current.id(true);
      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next);
    }
  }

  onInput(event) {
    this.$emit("table:input", $(event.target));
  }
}
