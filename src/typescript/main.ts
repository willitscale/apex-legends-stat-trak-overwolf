import { Controller } from "./controllers/controller";
import { MainController } from "./controllers/main-controller";
import { FileService } from "./services/file-service";
import { BackgroundController } from "./controllers/background-controller";
import $ from "jquery";

class Main {

  private controller: Controller | any = null;

  constructor() {
    FileService.instance(this.initialise.bind(this));
  }

  initialise() {
    switch (this.getController()) {

      case BackgroundController.FILE:
        this.controller = new BackgroundController;
        break;

      case MainController.FILE:
        this.controller = new MainController;
        break;
    }

    if (this.controller) {
      this.controller.run();
    }
  }

  private getController() {
    return window.location.pathname
      .replace('/files/html/', '')
      .split('/')[0]
      .split('.')[0];
  }
}

$(document).ready(function () {
  new Main();
});
