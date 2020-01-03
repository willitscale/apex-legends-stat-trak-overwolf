import { EventBus } from "./event-bus";

export interface ObjectWithStringKeysAndNumericalArrays {
    [key: string]: Array<number>;
}

export interface ObjectWithStringKeysAndNumericalValues {
    [key: string]: number;
}

export class PhaseService {

    public static readonly TOPIC = "PHASE";

    private currentPhase: number = 0;
    private currentPhaseTime: number = 0;
    private running: boolean = false;
    private map: string = '';

    private static readonly DELAY_1_SECOND = 1000;

    private static readonly PHASE_BY_KEY = [
        1,
        1.5,
        2,
        2.5,
        3,
        3.5,
        4,
        4.5,
        5,
        5.5,
        6,
        6.5,
        7,
        7.5,
        8,
        8.5
    ];

    private static readonly PHASE_BY_SECOND: ObjectWithStringKeysAndNumericalArrays = {
        // Erangel
        'Erangel_Main': [
            120,
            300,
            300,
            200,
            140,
            150,
            90,
            120,
            60,
            120,
            40,
            90,
            30,
            90,
            30,
            60
        ],
        // Mirimar
        'Desert_Main': [
            120,
            300,
            300,
            200,
            140,
            150,
            90,
            120,
            60,
            120,
            40,
            90,
            30,
            90,
            30,
            60
        ],
        // Vikindi
        'DihorOtok_Main': [
            90,
            300,
            300,
            120,
            90,
            120,
            90,
            60,
            90,
            60,
            90,
            30,
            90,
            90,
            60,
            60
        ],
        // Sanhok
        'Savage_Main': [
            90,
            240,
            240,
            40,
            120,
            90,
            120,
            60,
            120,
            40,
            60,
            50,
            60,
            40,
            40,
            50
        ]
    };

    private constructor() {
    }

    static get instance(): PhaseService {
        if (!(<any>overwolf.windows.getMainWindow()).pubgistics_phaseService) {
            (<any>overwolf.windows.getMainWindow()).pubgistics_phaseService = new PhaseService;
        }
        return (<any>overwolf.windows.getMainWindow()).pubgistics_phaseService;
    }

    init(map: string) {
        this.map = map;
        if (!PhaseService.PHASE_BY_SECOND[map]) {
            return;
        }
        
        this.currentPhase = 0;
        PhaseService._gameEvent('phase_game_length', this.getGameLength());
        PhaseService._gameEvent('phase_maps', this.getPhaseMaps());
        this.currentPhaseTime = PhaseService.PHASE_BY_SECOND[this.map][this.currentPhase];
    }

    public start(): void {
        this.running = true;
        PhaseService._gameEvent('phase_update', this.currentPhase);
        this.run(this, 0);
    }

    public run(that: PhaseService, counter: number): void {
        let callback = () => {
            if (!that.running || !PhaseService.PHASE_BY_SECOND[that.map]) {
                return;
            }

            if (counter >= that.currentPhaseTime && that.currentPhase < PhaseService.PHASE_BY_KEY.length) {
                PhaseService._gameEvent('phase_update', PhaseService.PHASE_BY_KEY[that.currentPhase]);
                that.currentPhase++;
                that.currentPhaseTime += PhaseService.PHASE_BY_SECOND[that.map][that.currentPhase];
            }

            PhaseService._gameEvent('phase_ticker', counter++);
            window.setTimeout(callback, PhaseService.DELAY_1_SECOND);
        };
        callback();
    }

    public stop(): void {
        this.running = false;
    }

    public getGameLength(): number {
        if (!PhaseService.PHASE_BY_SECOND[this.map]) {
            return 0;
        }

        let length = 0;
        let phases = PhaseService.PHASE_BY_SECOND[this.map];

        for(let i in phases) {
            length += phases[i];
        }

        return length;
    }

    public getPhaseMaps() {
        if (!PhaseService.PHASE_BY_SECOND[this.map]) {
            return [];
        }

        let phaseMap : ObjectWithStringKeysAndNumericalValues = {};
        let phases = PhaseService.PHASE_BY_SECOND[this.map];
        let phaseKeys = PhaseService.PHASE_BY_KEY;

        let length = 0;

        for(let i in phases) {
            length += phases[i];
            phaseMap['phase-' + phaseKeys[i]] = length;
        }

        return phaseMap;
    }

    static _gameEvent(event: string, data: any) {
        EventBus.instance.publish(event, data);
    }
}
