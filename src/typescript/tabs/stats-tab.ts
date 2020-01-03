import { Tab } from "./tab";

import { StatsService } from "../services/stats-service";
import $ from "jquery";

export class StatsTab implements Tab {

    private titles: { [key: string]: string } = {
        "0-0": "Unknown",
        "1-5": "Beginner_05",
        "1-4": "Beginner_04",
        "1-3": "Beginner_03",
        "1-2": "Beginner_02",
        "1-1": "Beginner_01",
        "2-5": "Novice_05",
        "2-4": "Novice_04",
        "2-3": "Novice_03",
        "2-2": "Novice_02",
        "2-1": "Novice_01",
        "3-5": "Experienced_05",
        "3-4": "Experienced_04",
        "3-3": "Experienced_03",
        "3-2": "Experienced_02",
        "3-1": "Experienced_01",
        "4-5": "Skilled_05",
        "4-4": "Skilled_04",
        "4-3": "Skilled_03",
        "4-2": "Skilled_02",
        "4-1": "Skilled_01",
        "5-5": "Specialist_05",
        "5-4": "Specialist_04",
        "5-3": "Specialist_03",
        "5-2": "Specialist_02",
        "5-1": "Specialist_01",
        "6-0": "Expert",
        "7-0": "Survivor"
    };

    public start() {
        this.buildImageList(
            StatsService.instance.stats.currentAttributes,
            '#current-rank-img',
            '#current-rank-score',
            '#current-rank-title'
        );

        this.statRollup();
    }

    public stop() {

    }

    public pause() {

    }

    public resume() {

    }

    private buildImageList(attributes: any, placeholder: string, score: string, title: string) {
        let bestRank: number = 0;
        let bestRankTitle: string = '0-0';

        for (let i in attributes) {
            let season = attributes[i];
            if (season.rankPoints > bestRank) {
                bestRank = season.rankPoints;
                bestRankTitle = season.rankPointsTitle;
            }
        }

        $(placeholder).attr('src', '../img/Ranks/' + this.titles[bestRankTitle] + '.png');
        $(score).html('' + Math.round(bestRank));
        $(title).html('' + this.titles[bestRankTitle].replace('_0', ' '));
    }

    private statRollup() {
        let totalKills = 0;
        let totalHeadshots = 0;
        let totalWins = 0;
        let totalGames = 0;
        
        let seasonKills = 0;
        let seasonHeadshots = 0;
        let seasonWins = 0;
        let seasonGames = 0;

        let weaponsAcquired = 0;
        let longestKill = 0;
        let longestTimeSurvived = 0;
        let maxKillStreaks = 0;

        for (let i in StatsService.instance.stats.currentAttributes) {
            let season = StatsService.instance.stats.currentAttributes[i];
            totalKills += season.kills;
            totalHeadshots += season.headshotKills;
            totalWins += season.wins;
            totalGames += season.roundsPlayed;

            seasonKills += season.kills;
            seasonHeadshots += season.headshotKills;
            seasonWins += season.wins;
            seasonGames += season.roundsPlayed;

            weaponsAcquired += season.weaponsAcquired;

            if (longestKill < season.longestKill) {
                longestKill = season.longestKill;
            }
            if (longestTimeSurvived < season.longestTimeSurvived) {
                longestTimeSurvived = season.longestTimeSurvived;
            }
            if (maxKillStreaks < season.maxKillStreaks) {
                maxKillStreaks = season.maxKillStreaks;
            }
        }

        for (let i in StatsService.instance.stats.attributes) {
            let season = StatsService.instance.stats.attributes[i];
            totalKills += season.kills;
            totalHeadshots += season.headshotKills;
            totalWins += season.wins;
            totalGames += season.roundsPlayed;
            
            weaponsAcquired += season.weaponsAcquired;
            
            if (longestKill < season.longestKill) {
                longestKill = season.longestKill;
            }
            if (longestTimeSurvived < season.longestTimeSurvived) {
                longestTimeSurvived = season.longestTimeSurvived;
            }
            if (maxKillStreaks < season.maxKillStreaks) {
                maxKillStreaks = season.maxKillStreaks;
            }
        }

        $('#current-kills').html('' + seasonKills);
        $('#current-headshots').html('' + seasonHeadshots + ' (' + Math.round(seasonHeadshots/seasonKills*100)/100 + '%)');
        $('#current-wins').html('' + seasonWins);
        $('#current-games').html('' + seasonGames + ' (' + Math.round(seasonWins/seasonGames*100)/100 + '%)');

        $('#lifetime-kills').html('' + totalKills);
        $('#lifetime-headshots').html('' + totalHeadshots + ' (' + Math.round(totalHeadshots/totalKills*100)/100 + '%)');
        $('#lifetime-wins').html('' + totalWins);
        $('#lifetime-games').html('' + totalGames + ' (' + Math.round(totalWins/totalGames*100)/100 + '%)');

        
        $('#feats-weapons').html('' + weaponsAcquired);
        $('#feats-longest').html('' + Math.round(longestKill) + 'm');
        let minutes = Math.round(longestTimeSurvived/60);
        let seconds = Math.round(longestTimeSurvived%60);
        $('#feats-survived').html('' + minutes + ':' + ((10 > seconds) ? '0' : '') + seconds);
        $('#feats-streak').html('' + maxKillStreaks);
    }
}