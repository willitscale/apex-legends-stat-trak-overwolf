import { LaunchSourceService } from "../services/launch-source-service";
import { WindowNames } from "../constants/window-names";
import { RunningGameService } from "../services/running-game-service";

export class ControllerWrapper {

  protected restore(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.restore(name, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  protected close(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.close(name, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  protected hide(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.hide(name, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  protected sendToBack(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.sendToBack(name, (result: any) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  protected position(name: string, left: number, top: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.changePosition(name, left, top, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  protected maximize(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.maximize(name, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  protected size(name: string, width: number, height: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.changeSize(name, width, height, (result) => {
          if (result.status === 'success') {
            resolve();
          } else {
            reject(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  protected async getStartupWindowName(): Promise<string> {
    let launchSource = LaunchSourceService.instance.getLaunchSource();

    if (launchSource === 'gamelaunchevent') {
      return WindowNames.BACKGROUND;
    }

    let isGameRunning = await RunningGameService.instance.isGameRunning();
    if (isGameRunning) {
      return WindowNames.BACKGROUND;
    }

    return WindowNames.BACKGROUND;
  }

  protected _getCurrentWindow(): Promise<any> {
    return new Promise((resolve, reject) => {
      overwolf.windows.getCurrentWindow(result => {
        if (result.status === 'success') {
          resolve(result.window);
        } else {
          reject(result);
        }
      });
    });
  }

  protected _obtainWindow(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        overwolf.windows.obtainDeclaredWindow(name, (response) => {
          if (response.status !== 'success') {
            return reject(response);
          }
          resolve(response);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  protected minimize(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.minimize(name, (result) => {
          if (result.status === 'success') {
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  protected getWindowState(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.getWindowState(name, (result) => {
          if (result.status === 'success') {
            resolve(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
