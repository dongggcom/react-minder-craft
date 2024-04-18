import * as React from 'react';
import IMinderNode from 'kityminder-core/src/core/node';
import IMinder from 'kityminder-core/src/core/minder';
import IRender from 'kityminder-core/src/core/render';
import IMinderEvent from 'kityminder-core/src/core/event';

type AnyFunction = (...args: any[]) => any;

declare namespace Kity  {
    type Layout = any;
    type Shape = any;
    type Matrix = any;
    type Box = any;
}

interface MinderTemplateSupport {
    getConnect: () => string;
    getLayout: () => Kity.Layout;
}

type TMinder = typeof IMinder;
type TMinderEvent = typeof IMinderEvent;
type TMinderNode = typeof IMinderNode;
type Render = typeof IRender;
type HotBox = any;

type FSM = any;

export type KMEditor = {
    [key: string]: unknown;
    editText: () => void;
    minder: Minder;
    container: HTMLElement;
    selector: HTMLElement;
    fsm: FSM;
    panelFsm: FSM;
    hotbox: HotBox;
    history: {
        hasRedo: () => boolean;
        hadUndo: () => boolean;
        redo: () => void;
        reset: () => void;
        undo: () => void;
    },
    receiver: {
        disable: () => void;
        element: HTMLDivElement;
        enable: () => void;
        listen: (state: string, listener: AnyFunction) => void;
        onblur: (handler: AnyFunction) => void;
        selectAll: () => void;
    }
};

export interface Minder extends TMinder {
    [key: string]: any;
    context: {
        store: Record<string, unknown>,
        get: <T>(key: string, defaultValue?: T) => any | T;
        set: (key: string, value: unknown) => void;
    };
    extend: Record<string,unknown>;
    // node
    getRoot: () => MinderNode;
    setRoot: (node: MinderNode) => void;
    getAllNode: () => MinderNode[];
    getNodeById: (id: string) => MinderNode;
    getNodesById: (ids: string[]) => MinderNode[];
    createNode: (textOrData?: string | MinderNode | Record<string, unknown> | null, parent?: MinderNode | null, index?: number) => MinderNode;
    appendNode: (node: MinderNode, parent: MinderNode, index?: number) => MinderNode;
    removeNode: (node: MinderNode) => void;
    attachNode: (node: MinderNode) => void;
    detachNode: (node: MinderNode) => void;
    getMinderTitle: () => string;
    // data
    setup: (target?: string) => Minder;
    exportJson: () => DataSource;
    Text2Children: (node: MinderNode, text: string) => void;
    exportNode: (node: MinderNode) => DataSource;
    importNode: (node: MinderNode, json: DataSource | NodeItem) => void;
    importJson: (json: DataSource) => Minder;
    exportData: (protocolName: string, option?: Record<string, unknown>) => Promise<unknown>;
    importData: (protocolName: string, data: unknown, option?: Record<string, unknown>) => Promise<unknown>;
    decodeData: (protocolName: string, data: unknown, option?: Record<string, unknown>) => Promise<unknown>;
    // event
    dispatchKeyEvent: (event: KeyboardEvent | MinderEvent) => void;
    on: (name: string, callback: AnyFunction) => Minder;
    off: (name: string, callback: AnyFunction) => void;
    fire: (type: string, params: Record<string, unknown>) => Minder;
    // layout
    getLayoutList: () => Kity.Layout[];
    getLayoutInstance: (name: string) => Kity.Layout;
    layout: (delay?: number) => Minder;
    refresh: (delay?: number) => Minder;
    applyLayoutResult: (root: MinderNode, duration: number, callback: AnyFunction) => Minder;
    // render
    renderNodeBatch: (nodes: MinderNode[]) => void;
    renderNode: (node: MinderNode) => void;
    // select
    renderChangedSelection: (last: MinderNode[]) => void;
    getSelectedNodes: () => MinderNode[];
    getSelectedNode: () => MinderNode | null;
    removeAllSelectedNodes: () => void;
    removeSelectedNodes: (nodes: MinderNode[]) => MinderNode;
    select: (nodes: MinderNode[], isSingleSelect?: boolean) => MinderNode;
    selectById: (ids: number | number[], isSingleSelect?: boolean) => MinderNode;
    toggleSelect: (node: MinderNode) => MinderNode;
    isSingleSelect: () => boolean;
    getSelectedAncestors: (includeRoot?: boolean) => MinderNode[];
    // template
    getTemplateList: () => Record<string, MinderTemplateSupport>[];
    useTemplate: (name: string, duration?: number) => void;
    getTemplate: () => string;
    setTemplate: (name?: string) => void;
    getTemplateSupport: (method: string) => MinderTemplateSupport;
    getTheme: (node?: MinderNode) => MinderTemplateSupport;
    // theme
    getThemeList: () => Record<string, CSSStyleDeclaration>;
    useTheme: (name: string) => boolean;
    setTheme: (name: string) => Minder;
    getThemeItems: () => string;
    getStyle: (item: string, node: MinderNode) => string | CSSStyleDeclaration | null;
    getNodeStyle: (node: MinderNode, name: string) => string | CSSStyleDeclaration | null;
}

export interface MinderNode extends TMinderNode {
    [key: string]: any;
    data: NodeData;
    parent: MinderNode | null;
    children: MinderNode[];
    // node
    isRoot: () => boolean;
    isLeaf: () => boolean;
    getRoot: () => MinderNode;
    getParent: () => MinderNode | null;
    getSiblings: () => MinderNode[];
    getLevel: () => number;
    getType: () => 'root' | 'main'| 'sub';
    isAncestorOf: (node: MinderNode) => boolean;
    getData: (key: string ) => any;
    setData: (key: string, value: any) => MinderNode;
    setText: (text: string) => void;
    getText: () => string;
    preTraverse: (fn: (node: MinderNode) => void, excludeThis?: boolean) => void;
    postTraverse: (fn: (node: MinderNode) => void, excludeThis?: boolean) => void;
    traverse: (fn: (node: MinderNode) => void, excludeThis?: boolean) => void;
    getChildren: () => MinderNode[];
    getIndex: () => number;
    insertChild: (node: MinderNode, index?: number) => void;
    appendChild: (node: MinderNode) => void;
    prependChild: (node: MinderNode) => void;
    removeChild: (node: MinderNode) => void;
    clearChildren: () => void;
    getChild: (index: number) => MinderNode;
    getRenderContainer: () => HTMLElement;
    getCommonAncestor: (node: MinderNode) => MinderNode;
    contains: (node: MinderNode) => boolean;
    clone: () => MinderNode;
    compareTo: (node: MinderNode) => boolean;
    getMinder: () => Minder;
    // connect
    getConnect: () => string;
    // layout
    getLayout: () => Kity.Layout;
    setLayout: (name: string) => MinderNode;
    layout: (name: string) => MinderNode;
    getLayoutInstance: () => Kity.Layout;
    getLayoutTransform: () => Kity.Matrix;
    getGlobalLayoutTransformPreview: () => Kity.Matrix;
    // layout 省略了一部分
    // render
    render: () => MinderNode;
    renderTree: () => MinderNode;
    getRenderer: (type: string) => Render;
    getContentBox: () => Kity.Box;
    getRenderBox: (renderType?: string, refer?: any) => any;
    // select
    isSelected: () => boolean;
    getStyle: () => string | CSSStyleDeclaration | null;
    // module: arrange
    arrange: (index: number) => MinderNode;
    // module: expand
    expand: () => void;
    collapse: () => void;
    isExpanded: () => boolean;
    isCollapsed: () => boolean;
}

export interface MinderEvent extends TMinderEvent {
    [key: string]: any;
    type: string;
    originEvent: Event;
    minder: Minder;
    getPosition: (refer: string | Kity.Shape) => {x: number, y: number};
    getTargetNode: () => MinderNode | null;
    stopPropagation: () => void;
    stopPropagationImmediately: () => void;
    shouldStopPropagation: () => boolean;
    shouldStopPropagationImmediately: () => boolean;
    preventDefault: () => void;
    isRightMB: () => boolean;
    getKeyCode: () => string;
}

export interface NodeData {
    [key: string]: unknown;
    text: string;
    progress?: string | null;
    priority?: string | null;
    note?: string | null;
    resource?: Array<string|number>;
    background?: string | null;
}

export interface NodeItem {
    data: NodeData;
    children: NodeItem[];
}

export interface DataSource {
    root?: NodeItem
}

export type MinderEditor = KMEditor & {
    getEditor: () => MinderEditor;
    updateEditor: (editor: KMEditor) => void;
}

interface ReactMinderCraftProps {
    [key: string]: unknown
    dataSource?: DataSource;
    context?: Record<string, unknown>;
    ref: React.Ref<MinderEditor>;
}

declare const ReactMinderCraft: React.ForwardRefExoticComponent<ReactMinderCraftProps>;
export default ReactMinderCraft;

export {};
