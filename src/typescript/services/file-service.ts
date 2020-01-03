import { PluginService } from "../services/plugin-service";
import { SettingsService } from "./settings-service";
import { StatsService } from "./stats-service";

export interface FileMap {
    [key: string]: (data: any) => void
};

export class FileService {

    public fileMap: FileMap = {};

    private pluginService: PluginService;

    private readonly LOCAL_PATH: string = "\\apexstattrak\\";

    private constructor(callback: () => void) {
        this.pluginService = new PluginService("simple-io-plugin", true);
        this.pluginService.initialize(this.fileSystemReady(callback));
    }

    public static instance(callback?: () => void) {
        if (!(<any>overwolf.windows.getMainWindow()).pubgistics_files) {
            if (!callback) {
                callback = () => { };
            }
            (<any>overwolf.windows.getMainWindow()).pubgistics_files = new FileService(callback);
        } else if (callback) {
            callback();
        }
        return (<any>overwolf.windows.getMainWindow()).pubgistics_files;
    }

    private fileSystemReady(callback: Function) {
        let that = this;
        let loadSequenceCallback = this.loadSequence(callback);
        this.fileMap = {
            'config.json': SettingsService.instance.set.bind(SettingsService.instance),
            'stats.json': StatsService.instance.set.bind(StatsService.instance)
        };
        return () => {
            for (let i in that.fileMap) {
                that.readFile(i, loadSequenceCallback(i));
            }
        };
    }

    private loadSequence(callback: Function) {
        let that = this;
        let returned = (file: string) => {
            return (status: any) => {
                if ('error' == status.status && "File doesn't exists" != status.reason) {
                    that.readFile(file, returned(file));
                } else {
                    that.fileMap[file](JSON.parse(status.content || "{}"));
                    delete that.fileMap[file];
                }
                if (0 == Object.keys(that.fileMap).length) {
                    callback();
                }
            };
        };
        return returned;
    }

    public writeFile(file: string, contents: any, callback?: any) {
        overwolf.io.writeFileContents(
            this.pluginService.get().LOCALAPPDATA + this.LOCAL_PATH + file,
            JSON.stringify(contents),
            'UTF8',
            true,
            callback
        );
    }

    public readFile(file: string, callback?: any) {
        overwolf.io.readFileContents(
            this.pluginService.get().LOCALAPPDATA + this.LOCAL_PATH + file,
            'UTF8',
            callback
        );
    }
}