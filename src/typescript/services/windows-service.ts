import { LaunchSourceService } from '../services/launch-source-service';
import { RunningGameService } from '../services/running-game-service';

import $ from "jquery";
import { SettingsService } from './settings-service';

export class WindowsService {

  private minimized: boolean;
  private maximized: boolean;
  private name: string;

  constructor(currentWindow: any) {
    this.name = currentWindow.name;
    this.minimized = 'minimized' == currentWindow.stateEx;
    this.maximized = 'maximized' == currentWindow.stateEx;
    this.bindings();
  }

  private bindings() {
    $('#window-discord').click(() => {
      overwolf.utils.openUrlInDefaultBrowser('https://discord.gg/bkCjgW3');
    });

    $('#window-help').click(() => {
      overwolf.utils.openUrlInDefaultBrowser('http://support-admin.overwolf.com/article-categories/apexstattrak/');
    });

    $('#window-minimize').click(() => {
      this.minimize(this.name);
    });

    $('#window-maximize').click(() => {
      this.maximize(this.name);
    });

    $('#window-close').click(() => {
      if (this.name == 'dashboard') {
        SettingsService.instance.setValue('setting-display-dashboard', false);
      }
      this.close(this.name);
    });
  }

  private _obtainWindow(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      overwolf.windows.obtainDeclaredWindow(name, (response) => {
        if (response.status !== 'success') {
          return reject(response);
        }

        resolve(response);
      });
    });
  }

  public restored() {
    this.maximized = false;
  }

  public maximizing() {
    this.maximized = true;
  }

  public restore(name: string): Promise<any> {

    this.restored();

    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.restore(name, (result) => {
          if (result.status === 'success') {
            resolve();
          }
        });
      } catch (e) {
        reject(e)
      }
    });
  }

  public minimize(name: string): Promise<any> {
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

  public async maximize(name: string): Promise<any> {
    let windowState = await this.getWindowState(name);
    if ('maximized' == windowState.window_state) {
      return this.restore(name);
    }

    this.maximizing();

    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.maximize(name, (result) => {
          if (result.status === 'success') {
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getWindowState(name: string): Promise<any> {
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

  public close(name: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.close(name, (result) => {
          if (result.status === 'success') {
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public dragMove(name: string): Promise<any> {
    let that = this;
    return new Promise(async (resolve, reject) => {
      try {
        await this._obtainWindow(name);
        overwolf.windows.dragMove(name, (result) => {
          if (result.status === 'success') {
            that.restored();
            resolve();
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}