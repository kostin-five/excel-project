export class TableSelection {
  static className = "selected";

  constructor() {
    this.group = [];
    this.current = null;
  }

  removeSelected() {
    this.group.forEach((el) => el.removeClass(TableSelection.className));
    this.group.length = 0;
  }

  select($el) {
    this.removeSelected();

    this.group.push($el);
    $el.focus().addClass(TableSelection.className);
    this.current = $el;
  }

  selectGroup($group = []) {
    this.removeSelected();

    this.group = $group;
    this.group.forEach(($el) => $el.addClass(TableSelection.className));
  }
}
