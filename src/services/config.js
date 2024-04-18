const conf = {};

function initConf() {
    this.config = {
    // 右侧面板最小宽度
        ctrlPanelMin: 250,

        // 右侧面板宽度
        ctrlPanelWidth: parseInt(window.localStorage.__dev_minder_ctrlPanelWidth) || 250,

        // 分割线宽度
        dividerWidth: 3,

        // 默认语言
        defaultLang: 'zh-cn',

        // 放大缩小比例
        zoom: [20, 30, 50, 80, 100, 120, 150, 180],

        // 图片上传接口
        imageUpload: 'server/imageUpload.php',
    };

    this.set = (key, value) => {
        const supported = Object.keys(this.config);
        let configObj = {};

        // 支持全配置
        if (typeof key === 'object') {
            configObj = key;
        }
        else {
            configObj[key] = value;
        }

        for (const i in configObj) {
            if (configObj.hasOwnProperty(i) && supported.indexOf(i) !== -1) {
                this.config[i] = configObj[i];
            }
            else {
                console.error('Unsupported config key: ', key, ', please choose in :', supported.join(', '));
                return false;
            }
        }

        return true;
    };

    this.get = key => {
        const me = this;
        if (!key) {
            return me.config;
        }

        if (me.config.hasOwnProperty(key)) {
            return me.config[key];
        }

        console.warn('Missing config key pair for : ', key);
        return '';
    };
    return this;
}

export default initConf.call(conf);
