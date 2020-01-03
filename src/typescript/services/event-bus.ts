export interface Subscriptions {
  [key: string]: (event: string, data: any) => void
};

export class EventBus {

  public static readonly WILDCARD: string = '*';
  private readonly subscriptions: Subscriptions = {};

  private constructor() {
  }

  static get instance(): EventBus {
    if (!(<any>overwolf.windows.getMainWindow()).pubgistics_eventBus) {
      (<any>overwolf.windows.getMainWindow()).pubgistics_eventBus = new EventBus;
    }
    return (<any>overwolf.windows.getMainWindow()).pubgistics_eventBus;
  }

  public subscribe(key: string, callback: (event: string, data: any) => void): void {
    this.subscriptions[key] = callback;
  }

  public publish(event: string, data: any): void {
    for (let i in this.subscriptions) {
      this.subscriptions[i](event, data);
    }
  }
}
