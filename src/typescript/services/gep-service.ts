import { EventBus } from "./event-bus";
import { StatsService } from "./stats-service";

export class GepService {

    public static readonly TOPIC_EVENT = "GAME_EVENT";
    public static readonly TOPIC_FEATURE = "GAME_FEATURE";

    private static readonly REQUIRED_FEATURES: string[] = [
        'death',
        'kill',
        'match_state',
        'me',
        'revive',
        'team',
        'roster',
        'kill_feed',
        'rank',
        'match_summary',
        'location',
        'match_info',
        'phase'
    ];

    private static readonly REGISTER_RETRY_TIMEOUT: number = 10000;

    protected constructor() {
    }

    static get instance(): GepService {
        if (!(<any>overwolf.windows.getMainWindow()).pubgistics_gameEventProvider) {
            (<any>overwolf.windows.getMainWindow()).pubgistics_gameEventProvider = new GepService;
        }
        return (<any>overwolf.windows.getMainWindow()).pubgistics_gameEventProvider;
    }

    public listen() {
        overwolf.games.events.setRequiredFeatures(
            GepService.REQUIRED_FEATURES,
            this.listener.bind(this)
        );
    }

    private listener(response: any) {
        if (response.status === 'error') {
            setTimeout(this.listen.bind(this), GepService.REGISTER_RETRY_TIMEOUT);
        } else if (response.status === 'success') {
            overwolf.games.events.onNewEvents.removeListener(GepService._handleGameEvent);
            overwolf.games.events.onNewEvents.addListener(GepService._handleGameEvent);

            overwolf.games.events.onInfoUpdates2.removeListener(GepService._handleInfoUpdate);
            overwolf.games.events.onInfoUpdates2.addListener(GepService._handleInfoUpdate);
        }
    }

    private static _handleGameEvent(eventsInfo: any) {
        for (let i = 0; i < eventsInfo.events.length; i++) {
            // console.log('Event', eventsInfo.events[i].name, JSON.stringify(eventsInfo.events[i]));
            switch (eventsInfo.events[i].name) {
                // Events with no data
                case 'match_start':
                    console.log(eventsInfo.events[i].name, 1);
                    EventBus.instance.publish(eventsInfo.events[i].name, 1);
                    break;

                case 'match_end':
                    console.log(eventsInfo.events[i].name, 1);
                    EventBus.instance.publish(eventsInfo.events[i].name, 1);
                    break;

                case 'death':
                    console.log(eventsInfo.events[i].name, 1);
                    EventBus.instance.publish(eventsInfo.events[i].name, 1);
                    break;
                
                case 'knocked_out':
                    console.log(eventsInfo.events[i].name, 1);
                    EventBus.instance.publish(eventsInfo.events[i].name, 1);
                    break;

                // Events with data

                // assist "{\r\n  \"victimName\": \"waslos555\",\r\n  \"type\": \"elimination\"\r\n}"
                case 'assist':
                    console.log(eventsInfo.events[i].name, eventsInfo.events[i].data);
                    EventBus.instance.publish(eventsInfo.events[i].name, JSON.parse(eventsInfo.events[i].data));
                    break;
                // knockdown "{\r\n  \"victimName\": \"GrubNas\"\r\n}"
                case 'knockdown':
                    console.log(eventsInfo.events[i].name, eventsInfo.events[i].data);
                    EventBus.instance.publish(eventsInfo.events[i].name, JSON.parse(eventsInfo.events[i].data));
                    break;
                // kill "{\r\n  \"victimName\": \"GrubNas\"\r\n}"
                case 'kill':
                    console.log(eventsInfo.events[i].name, eventsInfo.events[i].data);
                    EventBus.instance.publish(eventsInfo.events[i].name, JSON.parse(eventsInfo.events[i].data));
                    break;

                // Game wide events
                
                // kill_feed {
                //     "attackerName": "HP_Cheerful",
                //     "victimName": "MajesticM00se",
                //     "weaponName": "wingman",
                //     "action": "knockdown"
                //   }
                case 'kill_feed':
                    let kill = JSON.parse(eventsInfo.events[i].data);
                    if (kill.attackerName == StatsService.instance.stats.name || kill.victimName == StatsService.instance.stats.name) {
                        console.log(eventsInfo.events[i].name, eventsInfo.events[i].data);
                        EventBus.instance.publish(eventsInfo.events[i].name, JSON.parse(eventsInfo.events[i].data));
                    }
                    break;
            }
        }
    }

    private static _handleInfoUpdate(eventsInfo: any) {
        // console.log('Info', eventsInfo.feature, JSON.stringify(eventsInfo));
        switch (eventsInfo.feature) {
            // rank {"match_info":{"victory":"false"}}
            case 'rank':
                console.log(eventsInfo.feature, JSON.stringify(eventsInfo.info));
                EventBus.instance.publish(eventsInfo.feature, eventsInfo.info.match_info);
                break;
            // match_info {"match_info":{"pseudo_match_id":null}}
            case 'match_info':
                console.log(eventsInfo.feature, JSON.stringify(eventsInfo.info));
                EventBus.instance.publish(eventsInfo.feature, eventsInfo.info.match_info);
                break;
            // match_summary {"match_info":{"match_summary":"{\"rank\":\"3\",\"teams\":\"20\",\"squadKills\":\"4\"}"}}
            case 'match_summary':
                console.log(eventsInfo.feature, JSON.stringify(eventsInfo.info));
                EventBus.instance.publish(eventsInfo.feature, eventsInfo.info.match_info);
                break;
            // team {"match_info":{"team_info":"{\"team_state\":null}"}}
            case 'team':
                console.log(eventsInfo.feature, JSON.stringify(eventsInfo.info));
                EventBus.instance.publish(eventsInfo.feature, eventsInfo.info.match_info);
                break;
        }
    }
}
