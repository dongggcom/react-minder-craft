import React, {useCallback, useState, useEffect} from 'react';
import {Checkbox, Menu} from 'antd';
import {TagOutlined} from '@ant-design/icons';
import {without} from 'lodash';
import IconButton from '../../Standard/IconButton';
import {delay} from '../../../tool/afterMinderEventLifeCycle';
import CreateInput from './CreateInput';
import SearchInput from './SearchInput';

const ResourceSelector = ({editor, defaultUsed}) => {
    const {minder, extend: {createTagCondition = () => true}} = editor;
    const [options, setOptions] = useState([]);
    const [visible, setVisible] = useState();
    const [resources, setResources] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [selected, setSelected] = useState([]);

    const refreshValueAndOptions = useCallback(
        (selectedResource = [], filterResource) => {
            const enabled = minder.queryCommandState('resource') !== -1;
            const selected = enabled ? selectedResource : [];

            setResources(selected);
            setOptions((filterResource ?? minder.getUsedResource()).map(resourceName => ({
                name: resourceName,
                selected: selected.indexOf(resourceName) > -1,
                // 过滤掉 defaultUsed 期望隐藏的
                hidden: defaultUsed.some(u => (u.name === resourceName && u.hidden)),
            })));
        },
        [defaultUsed, minder]
    );

    const selectResource = useCallback(
        ({key}) => {
            const newSelected = selected.includes(key) ? without(selected, key) : [...selected, key];
            minder.execCommand('resource', newSelected);
            refreshValueAndOptions(newSelected);
            setSelected(newSelected);
        },
        [selected, minder, refreshValueAndOptions]
    );

    const addResource = useCallback(
        resource => {
            const origin = minder.queryCommandValue('resource');
            if (!resource || !/\S/.test(resource)) {
                return;
            }
            if (origin.indexOf(resource) === -1) {
                resources.push(resource);
                minder.fire('add-resource', {value: resource || null});
                if (createTagCondition(resource)) {
                    minder.execCommand('resource', resources);
                    refreshValueAndOptions(resources);
                }
            }
        },
        [createTagCondition, minder, refreshValueAndOptions, resources]
    );

    const searchReasource = useCallback(
        resource => {
            const selected = minder.queryCommandValue('resource');
            if (resource) {
                const filterResource = minder.getUsedResource().filter(value => value.includes(resource));
                refreshValueAndOptions(selected, filterResource);
            } else {
                refreshValueAndOptions(selected);
            }
        },
        [minder, refreshValueAndOptions]
    );

    const hide = useCallback(
        () => {
            setVisible(false);
        },
        []
    );

    const handleVisble = useCallback(
        () => {
            setVisible(!visible);
        },
        [visible]
    );

    const onVisibleChange = useCallback(
        v => setVisible(v),
        []
    );

    // 存在更新 defaultUsed 的情况
    useEffect(
        () => {
            // 注册 defaultUsed 在 node 中的颜色
            defaultUsed.forEach(u => {
                minder.getResourceColor(u.name);
                refreshValueAndOptions(minder.queryCommandValue('resource'));
            });
        },
        [defaultUsed, minder, refreshValueAndOptions]
    );

    useEffect(
        () => {
            if (minder) {
                minder.on('interactchange', () => {
                    refreshValueAndOptions(minder.queryCommandValue('resource'));
                    delay(() => {
                        setDisabled(minder.queryCommandState('resource') === -1);
                    });
                });
            }
        },
        [minder, refreshValueAndOptions]
    );


    return (
        <IconButton
            disabled={disabled}
            text={'标签'}
            icon={<TagOutlined />}
            visible={visible}
            onVisibleChange={onVisibleChange}
            onClick={handleVisble}
            onBlur={hide}
            // TODO: 这里不够优雅，可以通过暴露 api 的方式来控制 panel 展示
            // 用作标识 给外部调提供 api
            className="resource-editor"
            menu={
                <Menu onClick={selectResource}>
                    {/* 这里其实不太符合 html tag 语义 */}
                    <SearchInput onSearch={searchReasource} />
                    {options.map(resource => (
                        resource.hidden === true ? null
                            : (
                                <Menu.Item value={resource.name} key={resource.name}>
                                    <Checkbox checked={resource.selected} />
                                    {' '}
                                    {resource.name}
                                </Menu.Item>
                            )
                    ))}
                    <CreateInput onSubmit={addResource} />
                </Menu>
            }
        />
    );
};

export default ResourceSelector;
