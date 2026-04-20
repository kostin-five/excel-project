import { Excel } from "../components/excel/Excel";
import { Formula } from "../components/formula/Formula";
import { Header } from "../components/header/Header";
import { Table } from "../components/table/Table";
import { Toolbar } from "../components/toolbar/Toolbar";
import { createStore } from "../core/store/createStore";
import { Page } from "../core/page/Page";
import { storage } from "../core/utils";
import { normalizeInitialState } from "../redux/initialState";
import { rootReducer } from "../redux/rootReducer";
import { StateProcessor } from "../core/page/StateProcessor";

function storageName(param) {
  return "excel:" + param;
}

class LocaleStorageClient {
  constructor(name) {
    this.name = storageName(name);
  }

  save(state) {
    storage(this.name, state);
    return Promise.resolve();
  }

  get() {
    return new Promise((res) => {
      const state = storage(this.name);

      setTimeout(() => {
        res(state);
      }, 1500);
    });
  }
}

export class ExcelPage extends Page {
  constructor(param) {
    super(param);
    this.storeSub = null;
    this.processor = new StateProcessor(new LocaleStorageClient(this.params));
  }

  async getRoot() {
    const state = await this.processor.get();
    const store = createStore(rootReducer, normalizeInitialState(state));

    this.storeSub = store.subscribe(this.processor.listen);
    this.excel = new Excel({
      components: [Header, Toolbar, Formula, Table],
      store,
    });

    return this.excel.getRoot();
  }

  afterRender() {
    this.excel.init();
  }

  destroy() {
    this.excel.destroy();
    this.storeSub.unsubscribe();
  }
}
