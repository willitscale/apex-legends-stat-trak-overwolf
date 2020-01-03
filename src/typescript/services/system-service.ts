import { EventBus } from "./event-bus";

export class SystemService {

    public static readonly TOPIC_MONITORS = 'MONITORS';

    public monitors: any[] = [];

    protected constructor() {
    }

    static get instance(): SystemService {
        if (!(<any>overwolf.windows.getMainWindow()).pubgistics_systemServiceProvider) {
            (<any>overwolf.windows.getMainWindow()).pubgistics_systemServiceProvider = new SystemService;
        }
        return (<any>overwolf.windows.getMainWindow()).pubgistics_systemServiceProvider;
    }

    public register(callback: () => {}) {
        overwolf.utils.getMonitorsList(this.updateMonitors.bind(this, callback));
    }

    private updateMonitors(callback: () => {}, data: any) {
        if (data.displays) {
            this.monitors = data.displays;
            EventBus.instance.publish('update_monitors', this.monitors);
            callback();
        }
    }
}