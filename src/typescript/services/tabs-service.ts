import $ from "jquery";

export class TabsService {

    private config: any;

    constructor(config:any) {
        this.config = config;

        this.setListeners();
    }

    private setListeners() {
        for(let i in this.config) {
            let conf = this.config[i];
            $(conf.tab).click(this.setTab(i));
        }
    }

    private setTab(tab: string) {
        let that = this;
        return () => {
            for(let i in that.config) {
                that.config[i].selected = tab == i;

                if (that.config[i].selected) {
                    that.config[i].instance.start();
                    $(that.config[i].contents).removeClass('hidden');
                    $(that.config[i].tab).addClass('selected');
                } else {
                    that.config[i].instance.stop();
                    $(that.config[i].contents).addClass('hidden');
                    $(that.config[i].tab).removeClass('selected');
                }
            }
        };
    }

}