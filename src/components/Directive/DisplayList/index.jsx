import React, {useState, useCallback} from 'react';
import findIndex from 'lodash/findIndex';
import {difference} from 'lodash';
import {Menu, Checkbox} from 'antd';
import {FormatPainterOutlined} from '@ant-design/icons';
import IconButton from '../../Standard/IconButton';
import memory from '../../../services/memory';

const transformSelectedToArray = selected => selected.reduce((acc, cur) => {
    if (cur.selected) {
        acc.push(cur.value);
    }
    return acc;
}, []);

function DisplayList({editor}) {
    const {minder} = editor;
    const {context} = minder;
    const subNodeDescMap = minder.extend.context.subNodeDescMap;
    const nodeDisplayMap = minder.extend.context.nodeDisplayMap;

    const fireCommandAndSave = useCallback(
        (key, command, map, selected) => {
            const selectedArray = transformSelectedToArray(selected);
            const oldValue = memory.get(key) ?? [];
            const newValue = [];
            Object.keys(map).forEach(key => {
                selectedArray.includes(key) && newValue.push(key);
            });

            memory.set(key, newValue);
            context.set(key, selected);

            const hasDiff = oldValue.length >= newValue.length
                ? difference(oldValue, newValue).length
                : difference(newValue, oldValue).length;
            hasDiff && minder.fire(command, {selected});
        },
        [context, minder]
    );

    const getDefaultSelected = useCallback(
        () => {
            const memorizedCaseTest = memory.get('subNodeDesc') ?? Object.keys(subNodeDescMap);
            // 默认选中
            const memorizedNodeDisplay = memory.get('nodeDisplay') ?? (
                nodeDisplayMap ? Object.keys(nodeDisplayMap) : []
            );
            const meomrizedSelectedOptions = memorizedCaseTest.concat(memorizedNodeDisplay);
            const map = {...nodeDisplayMap, ...subNodeDescMap};
            const options = Object.keys(map).map(c => ({value: c, label: map[c]}));
            return options.map(option => ({
                ...option,
                selected: meomrizedSelectedOptions.includes(option.value),
            }));
        },
        [subNodeDescMap, nodeDisplayMap]
    );

    const [selected, setSelected] = useState(getDefaultSelected());

    const selectCaseTest = useCallback(
        key => () => {
            const index = findIndex(selected, ({value}) => value === key);
            if (index !== -1) {
                selected[index].selected = !selected[index].selected;

                // subNodeDesc 存储
                fireCommandAndSave('subNodeDesc', 'onchange-one-model', subNodeDescMap, selected);
                // 标识1展示存储
                fireCommandAndSave('nodeDisplay', 'onchange-node-display', nodeDisplayMap, selected);

                setSelected([...selected]);
            }
        },
        [subNodeDescMap, fireCommandAndSave, nodeDisplayMap, selected]
    );

    return (
        <IconButton
            icon={<FormatPainterOutlined />}
            menu={
                <Menu>
                    {selected.map(option => (
                        <Menu.Item onClick={selectCaseTest(option.value)} key={option.value}>
                            <Checkbox
                                checked={option.selected}
                                disabled={option.disabled}
                            />
                            {' '} {option.label}
                        </Menu.Item>
                    ))}
                </Menu>
            }
            text={'展示'}
        />
    );
}

export default DisplayList;


