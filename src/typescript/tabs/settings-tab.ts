import { Tab } from "./tab";
import { SettingsService } from "../services/settings-service";

import $ from "jquery";

export class SettingsTab implements Tab {

    private started: boolean = false;

    public start(): void {
        if (this.started) {
            this.resume();
        }
        this.started = true;
        this.setValues();
        this.bindListeners();
    }

    public stop(): void {

    }

    public pause(): void {

    }

    public resume(): void {

    }

    private setValues(): void {
        for (let property in SettingsService.instance.settings) {
            $('#' + property).attr('checked', SettingsService.instance.settings[property]);
        }
    }

    private bindListeners(): void {
        let that = this;
        for (let property in SettingsService.DEFAULT_VALUES) {
            $('#' + property).click(() => {
                SettingsService.instance.toggle(property);
            });
        }
    }
}
