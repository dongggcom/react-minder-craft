import $ from 'jquery';


export function preview(icon, keyword, $previewer, $container, setContent, setPosition) {
    const b = icon.getRenderBox('paper');

    $previewer[0].scrollTop = 0;

    setContent(keyword);

    const cw = $($container[0]).width();
    const ch = $($container[0]).height();
    const pw = $($previewer).outerWidth();
    const ph = $($previewer).outerHeight();
    let x = b.cx - pw / 2 - $container[0].offsetLeft;
    let y = b.bottom + 10 - $container[0].offsetTop;
    let ax = x + (pw / 2) - 10;
    let ay = y - 10;
    let aStyle = {
        transform: 'translateY(-11px) rotate(180deg)',
    };

    if (x < 0) {
        x = 10;
        ax = 10;
    }
    if (x + pw > cw) {
        x = b.left - pw - 15 - $container[0].offsetLeft;
        ax = x;
    }
    // 未触碰到上边界时，会触发
    if (y + ph > ch) {
        y = b.top - ph - 15 - $container[0].offsetTop;
        ay = y + ph;
        aStyle = {};
    }
    setPosition(x, y, ax, ay, aStyle);

    return true;
}
