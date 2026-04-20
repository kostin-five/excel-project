import { defaultTitle } from "../../constants";
import { $ } from "../../core/dom";
import { ExcelComponent } from "../../core/ExcelComponent";
import { ActiveRoute } from "../../core/routes/ActiveRoute";
import { debounce } from "../../core/utils";
import { changeTitle } from "../../redux/actions";

export class Header extends ExcelComponent {
  static className = "excel__header";

  constructor($root, options) {
    super($root, { name: "Header", listeners: ["input", "click"], ...options });
  }

  prepare() {
    this.onInput = debounce(this.onInput, 300);
  }

  toHTML() {
    const title = this.store.getState().title || defaultTitle;
    return `<input type="text" class="input" value="${title}" />

          <div>
            <div class="button" data-button="delete">
              <i class="material-icons" data-button="delete">delete</i>
            </div>

            <div class="button" data-button="exit">
              <i class="material-icons" data-button="exit">exit_to_app</i>
            </div>
          </div>`;
  }

  onInput(event) {
    const $target = $(event.target);
    this.$dispatch(changeTitle($target.text()));
  }

  onClick(event) {
    const $target = $(event.target);
    const value = $target.data.button;
    const keys = ["delete", "exit"];
    if (keys.includes(value)) {
      if (value === "exit") {
        window.location.hash = "";
      } else {
        if (confirm("Ты уверен что хочешь удалить?")) {
          localStorage.removeItem(`excel:${ActiveRoute.param}`);
          window.location.hash = "";
        }
      }
    }
  }
}
