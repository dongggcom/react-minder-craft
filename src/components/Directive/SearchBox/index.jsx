import React, {useEffect, useRef, useReducer} from 'react';
import {Input, Button} from 'antd';
import {
    UpOutlined,
    DownOutlined,
    CloseOutlined,
    SearchOutlined,
} from '@ant-design/icons';

let nodeSequence = [];
let searchSequence = [];

const initialSearchState = {
    tipVisible: false,
    resultNum: 0,
    curIndex: 0,
    lastKeyword: undefined,
    lastIndex: undefined,
};

const reducer = (state, {type, payload}) => {
    switch (type) {
        case 'initial':
            return {
                ...state,
                tipVisible: false,
            };
        case 'default':
            return {
                ...state,
                tipVisible: true,
                resultNum: 0,
                curIndex: 0,
            };
        case 'changeKeyword':
            return {
                ...state,
                lastKeyword: payload.keyword,
            };
        case 'changeIndex': {
            return {
                ...state,
                curIndex: payload.curIndex + 1,
                lastIndex: payload.curIndex,
            };
        }
        case 'changeResultNum':
            return {
                ...state,
                resultNum: searchSequence.length,
            };
        case 'refresh':
            return {...state};
        default:
            throw new Error('not match any action');
    }
};

function makeSearchSequence(keyword) {
    const sequence = [];

    for (let i = 0; i < nodeSequence.length; i++) {
        const node = nodeSequence[i];
        const text = node.getText().toLowerCase();
        if (text.indexOf(keyword) !== -1) {
            sequence.push({node: node});
        }
        const note = node.getData('note');
        if (note && note.toLowerCase().indexOf(keyword) !== -1) {
            sequence.push({node: node, keyword: keyword});
        }
    }
    searchSequence = sequence;
}

const SearchBox = ({editor, hiddenSearchBox}) => {
    const [state, dispatch] = useReducer(reducer, initialSearchState);
    const inputRef = useRef(null);
    const {minder} = editor;
    const tip = `第 ${state.curIndex} 条，共 ${state.resultNum} 条`;

    function showSearchResult(node, previewKeyword) {
        minder.execCommand('camera', node, 50);
        setTimeout(() => {
            minder.select(node, true);
            if (!node.isExpanded()) {
                minder.execCommand('expand', true);
            }
            if (previewKeyword) {
                minder.fire('shownoterequest', {node: node, keyword: previewKeyword});
            }
        }, 60);
    }

    function setSearchIndex(index) {
        const curIndex = (searchSequence.length + index) % searchSequence.length;

        dispatch({type: 'changeIndex', payload: {curIndex}});
        return curIndex;
    }

    function changeSearchResult(index = 0) {
        if (searchSequence.length) {
            const curIndex = setSearchIndex(index);
            showSearchResult(
                searchSequence[curIndex].node,
                searchSequence[curIndex].keyword
            );
        }
    }

    function makeNodeSequence() {
        nodeSequence = [];
        minder.getRoot().traverse(node => {
            nodeSequence.push(node);
        });
        makeSearchSequence(inputRef.current?.state.value);
        changeSearchResult();
    }

    const doSearch = direction => {
        dispatch({type: 'initial'});
        minder.fire('hidenoterequest');
        const keyword = inputRef.current?.state.value;

        if (!keyword || !/\S/.exec(keyword)) {
            inputRef.current?.focus();
            return;
        }

        const newSearch = state.lastKeyword !== keyword;

        // 当搜索不到节点时候默认的选项
        dispatch({type: 'default'});
        dispatch({type: 'changeKeyword', payload: {keyword}});

        if (newSearch) {
            makeSearchSequence(keyword);
        }

        dispatch({type: 'changeResultNum'});

        changeSearchResult(
            newSearch
                ? 0
                : (direction === 'next' ? state.lastIndex + 1 : state.lastIndex - 1) || 0
        );
    };

    function exitSearch() {
        inputRef.current?.blur();
        hiddenSearchBox();
        minder.fire('hidenoterequest');
        editor.receiver.selectAll();
    }

    function handleEnter(e) {
        const direction = e.shiftKey ? 'prev' : 'next';
        doSearch(e.target.value, direction);
    }

    const handleSearch = () => doSearch();

    const next = () => doSearch('next');

    const prev = () => doSearch('prev');

    useEffect(
        () => {
            minder.on('contentchange', makeNodeSequence);
            makeNodeSequence();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );

    return (
        <div id="search" className="search-box clearfix">
            <div className="input-group input-group-sm search-input-wrap">
                <Input
                    ref={inputRef}
                    onPressEnter={handleEnter}
                    addonAfter={state.tipVisible ? tip : null}
                />
            </div>
            <div className="btn-group btn-group-sm prev-and-next-btn" role="group">
                <Button
                    onClick={handleSearch}
                    icon={<SearchOutlined />}
                    style={{marginRight: 5}}
                />
                <Button onClick={prev} icon={<UpOutlined />} />
                <Button onClick={next} icon={<DownOutlined />} />
            </div>
            <Button type="link" icon={<CloseOutlined />} onClick={exitSearch} />
        </div>
    );
};

export default SearchBox;
