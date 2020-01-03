import { EventBus } from "./event-bus";
import { MatchModel } from "../models/match-model";
import { StatsService } from "./stats-service";
import request from "request";

export class MatchService {

    private currentMatch: MatchModel | any = null;
    private previousMatch: MatchModel | any = null;

    private constructor() {
    }

    public static get instance(): MatchService {
        if (!(<any>overwolf.windows.getMainWindow()).apexstattrak_match) {
            (<any>overwolf.windows.getMainWindow()).apexstattrak_match = new MatchService;
        }
        return (<any>overwolf.windows.getMainWindow()).apexstattrak_match;
    }


    public listen(): void {
        EventBus.instance.subscribe('match', this.eventListener.bind(this));
    }

    private eventListener(event: string, data: any): void {
        if (!this.currentMatch) {
            this.newMatch();
        }

        switch (event) {

            case 'team':
                for (let i in data) {
                    if (-1 != i.indexOf('legendSelect_')) {
                        this.legendChange(i, data[i]);
                    }
                }
                break;

            case 'match_start':
                this.currentMatch.session_start = new Date;
                break;

            case 'match_end':
                this.currentMatch.session_end = new Date;
                break;

            case 'death':
                this.currentMatch.deaths++;
                break;

            case 'knocked_out':
                this.currentMatch.knocked_out++;
                break;

            case 'assist':
                this.currentMatch.assists++;
                if (!this.currentMatch.assistVictims[data.victimName]) {
                    this.currentMatch.assistVictims[data.victimName] = 0;
                }
                this.currentMatch.assistVictims[data.victimName]++;
                break;

            case 'knockdown':
                this.currentMatch.knockdown++;
                if (!this.currentMatch.knockdownVictims[data.victimName]) {
                    this.currentMatch.knockdownVictims[data.victimName] = 0;
                }
                this.currentMatch.knockdownVictims[data.victimName]++;
                break;

            case 'kill':
                this.currentMatch.kills++;
                if (!this.currentMatch.killVictims[data.victimName]) {
                    this.currentMatch.killVictims[data.victimName] = 0;
                }
                this.currentMatch.killVictims[data.victimName]++;
                break;

            case 'kill_feed':
                this.statsUpdate(data);
                break;

            case 'match_info':
                if (data.pseudo_match_id && !this.currentMatch.match_id) {
                    this.currentMatch.match_id = data.pseudo_match_id;
                }
                break;

            case 'rank':
                if (data.victory != null) {
                    this.currentMatch.win = data.victory;
                }
                break;

            case 'match_summary':
                let matchSummary = JSON.parse(data.match_summary);
                this.currentMatch.rank = matchSummary.rank;
                this.currentMatch.squad_kills = matchSummary.squadKills;
                this.newMatch();
                break;

        }
    }

    private statsUpdate(data: any): void {
        if (StatsService.instance.stats.name == data.victimName) {
            this.victimStatsUpdate(data);
        } else if (StatsService.instance.stats.name == data.attackerName) {
            this.weaponStatsUpdate(data);
        }
    }

    private weaponStatsUpdate(data: any): void {
        if (data.weaponName) {
            data.weaponName = this.weaponName(data.weaponName);
        }
        switch (data.action) {
            case 'headshot_kill':
                this.addWeapon(data.weaponName);
                this.currentMatch.weaponStats[data.weaponName].headshots++;
                this.currentMatch.weaponStats[data.weaponName].kills++;
                break;
            case 'knockdown':
                this.addWeapon(data.weaponName);
                this.currentMatch.weaponStats[data.weaponName].knockdowns++;
                break;
            case 'kill':
                this.addWeapon(data.weaponName);
                this.currentMatch.weaponStats[data.weaponName].kills++;
                break;
        }
    }

    private addWeapon(weapon: string) {
        if (!this.currentMatch.weaponStats[weapon]) {
            this.currentMatch.weaponStats[weapon] = {
                knockdowns: 0,
                kills: 0,
                headshots: 0
            };
        }
    }

    private weaponName(weapon: string): string {
        return weapon.replace('rui/ordnance_icons/', '');
    }

    private victimStatsUpdate(data: any): void {
        switch (data.action) {

            case 'headshot_kill':
            case 'knockdown':
                if (!this.currentMatch.knockedOutAttacker[data.attackerName]) {
                    this.currentMatch.knockedOutAttacker[data.attackerName] = 0;
                }
                this.currentMatch.knockedOutAttacker[data.attackerName]++;
                break;

            case 'kill':
            case 'Finisher':
            case 'Bleed Out':
                if (!this.currentMatch.deathAttacker[data.attackerName]) {
                    this.currentMatch.deathAttacker[data.attackerName] = 0;
                }
                this.currentMatch.deathAttacker[data.attackerName]++;
                break;
        }
    }

    private legendChange(position: any, data: any) {
        if ('legendSelect_0' == position) {
            this.newMatch();
        }

        let legendData = JSON.parse(data);

        legendData.legendName = legendData.legendName.replace('#character_', '').replace('_NAME', '');

        if (legendData.playerName == StatsService.instance.stats.name) {
            this.currentMatch.legend = legendData.legendName;
            this.currentMatch.lead = legendData.lead;
        } else {
            this.currentMatch.teammates.push(legendData);
        }
    }

    private newMatch(): void {

        if (this.currentMatch && this.previousMatch) {
            if ('' == this.currentMatch.legend) {
                this.currentMatch.legend = this.previousMatch.legend;
            }
        }

        delete this.previousMatch;

        this.previousMatch = this.currentMatch;
        this.currentMatch = new MatchModel;

        if (null != this.previousMatch && this.previousMatch.match_id) {
            this.sendData();
        }
    }

    private sendData() {
        let url = 'https://f43vvy1gq9.execute-api.eu-west-1.amazonaws.com/apex-stat-trak/player/' + StatsService.instance.stats.name + '/match/' + this.previousMatch.match_id;
        request.post(
            url,
            {
                json: this.previousMatch
            },
            () => { }
        );
    }
}