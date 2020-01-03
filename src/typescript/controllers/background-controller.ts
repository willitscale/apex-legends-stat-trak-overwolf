import { Controller } from "./controller";
import { WindowNames } from "../constants/window-names";
import { ControllerWrapper } from "./controller-wrapper";
import { GepService } from "../services/gep-service";
import { StatsService } from "../services/stats-service";
import { MatchService } from "../services/match-service";

export class BackgroundController extends ControllerWrapper implements Controller {

    public static readonly FILE = "background";

    private damageDimension: number = 0;

    public run(): void {
        this.start();
    }

    private async start() {
        this._registerAppLaunchTriggerHandler();
        let startupWindow = await this.getStartupWindowName();
        await this.restore(startupWindow);
        await this.restore(WindowNames.MAIN);
        MatchService.instance.listen();
        StatsService.instance.listen();
        GepService.instance.listen();
    }

    private _registerAppLaunchTriggerHandler() {
        overwolf.extensions.onAppLaunchTriggered.removeListener(this._onAppRelaunch.bind(this));
        overwolf.extensions.onAppLaunchTriggered.addListener(this._onAppRelaunch.bind(this));
    }

    private _onAppRelaunch() {
        this.restore(WindowNames.MAIN);
    }
}
