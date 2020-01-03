export class MatchModel {

    // Meta
    public session_start: Date = new Date;
    public session_end: Date = new Date;
    public match_id: string = "";

    // Stats
    public knocked_out: number = 0;
    public deaths: number = 0;
    
    public kills: number = 0;
    public knockdown: number = 0;
    public assists: number = 0;

    public legend: string = "";
    public lead: boolean = false;

    public rank: number = 0;
    public win: boolean = false;
    public squad_kills: number = 0;

    // History
    public knockedOutAttacker: {} = {};
    public deathAttacker: {} = {};
    
    public knockdownVictims: {} = {};
    public killVictims: {} = {};
    public assistVictims: {} = {};

    public weaponStats: {} = {};

    // Team information
    public teammates: [] = [];
}
