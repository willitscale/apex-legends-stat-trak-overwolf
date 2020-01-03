import { FileService } from "./file-service";

export class SettingsService {

    public static readonly FILE_NAME = "config.json";

    public static readonly DEFAULT_VALUES = {
        'setting-download-asynchronous': false,
        'setting-download-in-game': false,
        'setting-processing-multi-threaded': false,
        'setting-processing-in-game': false,
        'setting-display-overlay': true,
        'setting-display-damage': true,
        'setting-display-dashboard': false,
        'setting-display-dashboard-monitor': ''
    };

    public settings: any;

    private constructor() {
        this.settings = SettingsService.DEFAULT_VALUES;
    }

    public static get instance(): SettingsService {
        if (!(<any>overwolf.windows.getMainWindow()).pubgistics_settingsService) {
            (<any>overwolf.windows.getMainWindow()).pubgistics_settingsService = new SettingsService;
        }
        return (<any>overwolf.windows.getMainWindow()).pubgistics_settingsService;
    }
    
    public set(settings: any): void {
        if (!settings || Object.entries(settings).length == 0) {
            this.settings = SettingsService.DEFAULT_VALUES;
        } else {
            this.settings = settings;
        }
    }

    public get(key?: string): any {
        if (!key) {
            return this.settings;
        }

        return this.settings[key];
    }

    public setValue(key: string, value: any): void {
        this.settings[key] = value;
        this.save();
    }

    public toggle(key: string): boolean {
        if (undefined == typeof this.settings[key]) {
            this.settings[key] = false;
        }
        this.settings[key] = !this.settings[key];
        this.save();
        return this.settings[key];
    }

    public save(callback?: () => {}): void {
        FileService.instance().writeFile(
            SettingsService.FILE_NAME,
            SettingsService.instance.settings,
            callback
        );
    }
}
