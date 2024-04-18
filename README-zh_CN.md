## react-minder-craft 
[kityminder-editor](https://github.com/fex-team/kityminder-editor) 是 `React` 重构版本。

用更现代的 UI 组件库改善用户体验。

> 这里使用了 `antd`，其他组件库仍然可以替换。

## 安装

```bash
yarn install
```

## 使用
```jsx
import React from 'react';
import 'react-minder-craft/dist/css/index.css';
import ReactMinderCraft from 'react-minder-craft/es';


export default () => <ReactMinderCraft />
```

## 样例

```bash
yarn start
```

更多样例查看 `example` 目录。也可以查看开发细节 [handbook](https://github.com/dongggcom/react-minder-craft/doc/handbook.md)

## F&Q

如果想本地调试，可能需要先安装 `react` `react-dom` 和 `antd`，具体可以查看 `package.json > peerDependencies`