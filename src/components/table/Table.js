import { ExcelComponent } from "../../core/ExcelComponent";
import { createTable } from "./table.template";
import { $ } from "./../../core/dom";
import { resizeHandler } from "./table.resize";
import { isCell, shouldResize, matrix, nextSelector } from "./table.functions";
import { TableSelection } from "./TableSelection";
import * as actions from "@/redux/actions";
import { defaultStyles } from "../../constants";
import { parse } from "../../core/parse";

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
    return createTable(30, this.store.getState());
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit("table:select", $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(actions.changeStyles(styles));
  }

  init() {
    super.init();

    this.selectCell(this.$root.find('[data-id="0:0"]'));

    this.$on("formula:input", (value) => {
      this.selection.current.attr("data-value", value).text(parse(value));
      this.updateTextInStore(value);
    });

    this.$on("formula:done", () => {
      this.selection.current.focus();
    });

    this.$on("toolbar:applyStyle", (value) => {
      this.selection.applyStyle(value);
      this.$dispatch(
        actions.applyStyle({
          value,
          ids: this.selection.selectedIds,
        })
      );
    });
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize(data));
    } catch (e) {
      console.warn("resize err", e.message);
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event);
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

  updateTextInStore(value) {
    this.$dispatch(
      actions.changeText({
        id: this.selection.current.id(),
        value,
      })
    );
  }

  onInput(event) {
    const text = $(event.target).text();
    this.updateTextInStore(text);
  }
}
