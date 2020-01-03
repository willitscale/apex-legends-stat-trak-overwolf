export class PluginService {

    private _pluginInstance: object | any = null;
    private _extraObjectName: string;
    private _addNameToObject: boolean;

    constructor(extraObjectNameInManifest: string, addNameToObject: boolean) {
        this._extraObjectName = extraObjectNameInManifest;
        this._addNameToObject = addNameToObject;
    }

    initialize(callback: Function) {
        return this._initialize(callback);
    }

    initialized() {
        return this._pluginInstance != null;
    }

    get() {
        return this._pluginInstance;
    }

    private _initialize(callback: Function) {
        let proxy = null;
        let that = this;

        try {
            proxy = overwolf.extensions.current.getExtraObject;
        } catch (e) {
            return callback(false);
        }
        
        proxy(this._extraObjectName, this.proxyCallback(callback));
    }

    private proxyCallback(callback: Function) {
        let that = this;
        return (result: any) => {
            if (result.status != "success") {
                return callback(false);
            }

            that._pluginInstance = result.object;

            if (that._addNameToObject) {
                that._pluginInstance._PluginName_ = that._extraObjectName;
            }

            return callback(true);
        };
    }
}