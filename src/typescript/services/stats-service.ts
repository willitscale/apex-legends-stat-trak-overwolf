import { FileService } from "./file-service";
import { EventBus } from "./event-bus";
import App from "../app";

export class StatsService {

    public static readonly TOPIC = "STATS_SERVICE";
    public static readonly FILE_NAME = "stats.json";
    public stats: any;

    private constructor() {
    }

    public static get instance(): StatsService {
        if (!(<any>overwolf.windows.getMainWindow()).apexstattrak_stats) {
            (<any>overwolf.windows.getMainWindow()).apexstattrak_stats = new StatsService;
        }
        return (<any>overwolf.windows.getMainWindow()).apexstattrak_stats;
    }

    public set(stats: any): void {
        this.stats = stats;
    }

    public get(): any {
        return this.stats;
    }

    public listen(): void {
        EventBus.instance.subscribe('stats', this.eventListener.bind(this));
    }

    private eventListener(event: string, data: any): void {
        switch (event) {
            case 'me':
                this.setName(JSON.parse(data.game_info.name).name);
                break;
        }
    }

    public save(callback: Function): void {
        StatsService.instance.stats.lastUpdated = new Date().getTime();
        StatsService.instance.stats.version = App.VERSION;
        FileService.instance().writeFile(
            StatsService.FILE_NAME,
            StatsService.instance.stats,
            callback
        );
    }

    public setName(name: string): void {
        if (!name) {
            return;
        }

        if (!this.stats.name || this.stats.name != name) {
            this.stats = {
                "name": name
            };
            this.save(() => {});
        }
        
        EventBus.instance.publish("player_name_set", name);
    }
}
