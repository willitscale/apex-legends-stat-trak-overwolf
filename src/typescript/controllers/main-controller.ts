import { Controller } from "./controller";
import { DragService } from "../services/drag-service";
import { WindowsService } from "../services/windows-service";
import { TabsService } from "../services/tabs-service";
import { HomeTab } from "../tabs/home-tab";
import { StatsTab } from "../tabs/stats-tab";
import { SettingsTab } from "../tabs/settings-tab";
import { EventBus } from "../services/event-bus";
import { StatsService } from "../services/stats-service";
import App from "../app";
import $ from "jquery";

export class MainController implements Controller {

    public static readonly FILE = "main";

    private readonly header: HTMLElement | any = document.getElementById('main-page');

    constructor() {
        let that = this;
        overwolf.windows.getCurrentWindow(result => {
            let windowsService = new WindowsService(result.window);
            new DragService(windowsService, result.window, that.header);
        });
        this.setVersion();
    }

    public run(): void {
        new TabsService(this.tabConfig());
        EventBus.instance.subscribe('main', this.eventListener.bind(this));
        this.setupUser();
    }

    private setupUser(): void {
        if (StatsService.instance.stats.name) {
            this.playerLoggedIn();
        } else {
            this.playerPendingLogin();
        }
    }

    private eventListener(event: string, data: any): void {
        switch (event) {
            case 'get_player_error':
                this.connectionFailure();
                break;
            case 'player_name_set':
            case 'player_data_set':
                this.playerLoggedIn();
                break;
        }
    }

    private playerLoggedIn(): void {
        $('#logged-in-as')
            .removeClass()
            .attr('class', 'logged-in logged-in-success')
            .html('<i class="far fa-check-circle"></i> Tracking player <span>' + StatsService.instance.stats.name + '</span>');
    }

    private connectionFailure(): void {
        $('#logged-in-as')
            .removeClass()
            .attr('class', 'logged-in logged-in-failure')
            .html('<i class="fas fa-exclamation-triangle"></i> Connection failure, will retry again in a moment.');
    }

    private playerPendingLogin(): void {
        $('#logged-in-as')
            .removeClass()
            .attr('class', 'logged-in logged-in-pending')
            .html('<i class="fas fa-exclamation-triangle"></i> You need to start the game before your stats can be tracked.');
    }

    private tabConfig() {
        return {
            "home": {
                tab: '#tab-home',
                contents: '#tabs-home-content',
                instance: new HomeTab,
                selected: true
            },
            "stats": {
                tab: '#tab-stats',
                contents: '#tabs-stats-content',
                instance: new StatsTab,
                selected: false
            },
            "settings": {
                tab: '#tab-settings',
                contents: '#tabs-settings-content',
                instance: new SettingsTab,
                selected: false
            }
        };
    }

    private setVersion() {
        $('#app-version small').html(App.VERSION);
    }
}