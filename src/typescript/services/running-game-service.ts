interface GameRunningChangedListener {
  (payload?: any): void;
}

interface GameInformation {
  gameWidth: number;
  gameHeight: number;
  screenWidth: number;
  screenHeight: number;
}

export class RunningGameService {

  public gameInfo: GameInformation = {
    gameWidth: 0,
    gameHeight: 0,
    screenWidth: 0,
    screenHeight: 0
  };

  private readonly _gameRunningChangedListeners: GameRunningChangedListener[] = [];

  private static _instance: RunningGameService;

  protected constructor() {
    overwolf.games.onGameInfoUpdated.removeListener(this._onGameInfoUpdated.bind(this));
    overwolf.games.onGameInfoUpdated.addListener(this._onGameInfoUpdated.bind(this));
  }

  static get instance(): RunningGameService {
    if (!(<any>overwolf.windows.getMainWindow()).pubgistics_runningGameService) {
        (<any>overwolf.windows.getMainWindow()).pubgistics_runningGameService = new RunningGameService;
    }
    return (<any>overwolf.windows.getMainWindow()).pubgistics_runningGameService;
  }

  private _onGameInfoUpdated(event: any) {
    let gameRunning;
    this.setDimensions(event.gameInfo);
    if (event && (event.resolutionChanged || event.runningChanged || event.gameChanged)) {
      gameRunning = (event.gameInfo && event.gameInfo.isRunning);
      for (let listener of this._gameRunningChangedListeners) {
        listener(gameRunning);
      }
    }
  }

  public async isGameRunning() {
    let gameRunning = await this._isGameRunning();
    return gameRunning;
  }

  private _isGameRunning() {
    let that = this;
    return new Promise((resolve => {
      overwolf.games.getRunningGameInfo(function (event) {
        let isRunning = event && event.isRunning;
        that.setDimensions(event);
        resolve(isRunning);
      });
    }));
  }

  public addGameRunningChangedListener(callback: GameRunningChangedListener) {
    this._gameRunningChangedListeners.push(callback);
  }

  private setDimensions(event: any) {
    if (event) {
      this.gameInfo.gameWidth = event.width;
      this.gameInfo.gameHeight = event.height;
      this.gameInfo.screenWidth = event.logicalWidth;
      this.gameInfo.screenHeight = event.logicalHeight;
    }
  }

  public actualWidth(width: any) {
    return Math.round(this.gameInfo.screenWidth / this.gameInfo.gameWidth * width);
  }

  public actualHeight(height: any) {
    return Math.round(this.gameInfo.screenHeight / this.gameInfo.gameHeight * height);
  }
}