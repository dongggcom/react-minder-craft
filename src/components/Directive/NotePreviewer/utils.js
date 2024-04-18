import marked from 'marked';
import $ from 'jquery';

marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
});

export function preview(node, keyword, $previewer, $container, setContent, setPostion) {
    const icon = node.getRenderer('NoteIconRenderer').getRenderShape();
    const b = icon.getRenderBox('screen');
    const note = node.getData('note');

    $previewer[0].scrollTop = 0;

    let html = marked(note);
    if (keyword) {
        html = html.replace(new RegExp('(' + keyword + ')', 'ig'), '<span class="highlight">$1</span>');
    }

    setContent(html);
    // scope.$apply(); // 让浏览器重新渲染以获取 previewer 提示框的尺寸

    const cw = $($container[0]).width();
    const ch = $($container[0]).height();
    const pw = $($previewer).outerWidth();
    const ph = $($previewer).outerHeight();

    let x = b.cx - pw / 2 - $container[0].offsetLeft;
    let y = b.bottom + 10 - $container[0].offsetTop;

    if (x < 0) {
        x = 10;
    }
    if (x + pw > cw) {
        x = b.left - pw - 10 - $container[0].offsetLeft;
    }
    if (y + ph > ch) {
        y = b.top - ph - 10 - $container[0].offsetTop;
    }

    setPostion(x, y);

    const view = $previewer[0].querySelector('.highlight');
    if (view) {
        view.scrollIntoView();
    }
    return true;

    // scope.$apply(); ?
}
