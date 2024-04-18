import $ from 'jquery';

const hideByClickAnyWhere = (visible, hideFunction) => {
    if (visible) {
        $(document.body).on('click.hideFunction', () => {
            console.log('click hideFunction')
            hideFunction();
            $(document.body).off('.hideFunction');
        });
    }
}

export default hideByClickAnyWhere;
