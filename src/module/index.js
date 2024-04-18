// eslint-disable-next-line no-undef
define(require => {
    // 调整加载顺序会更改图标顺序
    require('./core');
    require('./text');
    require('./font');
    require('./priority');
    require('./resource');
    require('./dragtree');
    require('./node');
    require('./detail');
    require('./modelType');
    require('./commentCount');
    require('./comment');
    require('./childSizeAlert');
    require('./title');
    require('./expand');
    require('./status');
    require('./zoom');
    require('./select');
    require('./keynav');
});
