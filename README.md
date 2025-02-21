## react-minder-craft 
Rebuild [kityminder-editor](https://github.com/fex-team/kityminder-editor) with React, base on [ant design](https://github.com/ant-design/ant-design).

English | [简体中文](./README.zh-CN.md)

> base on antd design

## Installation

```bash
yarn install
```

## Usage
```jsx
import React from 'react';
import 'react-minder-craft/dist/css/index.css';
import ReactMinderCraft from 'react-minder-craft/dist/es';


export default () => <ReactMinderCraft />
```

## Demo

```bash
yarn start
```

For more detail instructions, refer to `example` directory. Here are some development note: [handbook](./doc/handbook.md)

## Screenshots

![screenshot](./doc/images/screenshot.png)


## F&Q

If you want to run it locally, ensure you have installed `react` `react-dom` and `antd`. Check `package.json > peerDependencies` for more futher details.