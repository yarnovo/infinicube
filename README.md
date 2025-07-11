# Infinicube

<div align="center">
  <h3>🎯 3D 无限画布资源管理组件</h3>
  <p>为 AI 时代打造的三维资源可视化管理方案</p>
</div>

## 简介

Infinicube 是一个基于 React Three Fiber 和 @react-three/drei 的 React 组件库，提供了一个 3D 无限画布组件，让用户能够在三维空间中可视化管理资源。通过将资源表示为各种几何体，用户可以在无限延伸的 3D 空间中组织、浏览和管理自己的资源库。

## 特性

- 🌐 **无限延伸的 3D 空间** - 在 X、Y、Z 三个方向无限扩展
- 🎨 **多样化几何体** - 立方体、球体、圆柱体等多种形状
- 🖱️ **直观的交互体验** - 支持拖拽、旋转、缩放等操作
- ⚡ **高性能渲染** - 视锥体剔除、LOD、实例化渲染等优化
- 🎯 **资源映射** - 每个几何体代表一个资源（文件、链接、笔记等）
- 🔍 **快速定位** - 搜索和筛选功能帮助快速找到资源
- 🎨 **主题定制** - 支持自定义颜色和材质主题
- 📱 **响应式设计** - 适配各种屏幕尺寸

## 安装

```bash
npm install infinicube
# 或
yarn add infinicube
# 或
pnpm add infinicube
```

## 快速开始

### 基础用法

```jsx
import React from 'react';
import { World } from 'infinicube';
import { Box } from '@react-three/drei';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <World showGrid={true} showStats={false}>
        <Box position={[0, 1, 0]}>
          <meshStandardMaterial color="orange" />
        </Box>
      </World>
    </div>
  );
}

export default App;
```

### 带配置的用法

```jsx
import React, { useState } from 'react';
import { Infinicube } from 'infinicube';
import 'infinicube/dist/style.css';

function App() {
  const [resources, setResources] = useState([
    {
      id: '1',
      type: 'file',
      name: '项目文档.pdf',
      shape: 'box',
      position: { x: 0, y: 0, z: 0 },
      color: '#4A90E2',
      metadata: {
        size: '2.5MB',
        created: '2024-01-15',
        tags: ['文档', '项目'],
      },
    },
    {
      id: '2',
      type: 'link',
      name: 'GitHub 仓库',
      shape: 'sphere',
      position: { x: 5, y: 0, z: 0 },
      color: '#F5A623',
      metadata: {
        url: 'https://github.com/example/repo',
        tags: ['代码', '开源'],
      },
    },
  ]);

  const handleResourceCreate = (resource) => {
    console.log('创建资源:', resource);
    setResources([...resources, resource]);
  };

  const handleResourceSelect = (resource) => {
    console.log('选中资源:', resource);
  };

  const handleResourceUpdate = (updatedResource) => {
    console.log('更新资源:', updatedResource);
    setResources(resources.map((r) => (r.id === updatedResource.id ? updatedResource : r)));
  };

  const handleResourceDelete = (resourceId) => {
    console.log('删除资源:', resourceId);
    setResources(resources.filter((r) => r.id !== resourceId));
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Infinicube
        initialResources={resources}
        enabledShapes={['box', 'sphere', 'cylinder', 'cone']}
        theme={{
          background: '#1a1a1a',
          grid: '#333333',
          selection: '#00ff00',
        }}
        onResourceCreate={handleResourceCreate}
        onResourceSelect={handleResourceSelect}
        onResourceUpdate={handleResourceUpdate}
        onResourceDelete={handleResourceDelete}
      />
    </div>
  );
}

export default App;
```

## API 文档

### Infinicube 组件 Props

| 属性                | 类型                           | 默认值                          | 描述             |
| ------------------- | ------------------------------ | ------------------------------- | ---------------- |
| `width`             | `string \| number`             | `'100%'`                        | 组件宽度         |
| `height`            | `string \| number`             | `'100%'`                        | 组件高度         |
| `initialResources`  | `Resource[]`                   | `[]`                            | 初始资源数据     |
| `enabledShapes`     | `Shape[]`                      | `['box', 'sphere', 'cylinder']` | 启用的几何体类型 |
| `theme`             | `Theme`                        | 默认主题                        | 主题配置         |
| `gridSize`          | `number`                       | `10`                            | 网格大小         |
| `maxRenderDistance` | `number`                       | `1000`                          | 最大渲染距离     |
| `enablePhysics`     | `boolean`                      | `false`                         | 是否启用物理引擎 |
| `onResourceCreate`  | `(resource: Resource) => void` | -                               | 资源创建回调     |
| `onResourceSelect`  | `(resource: Resource) => void` | -                               | 资源选择回调     |
| `onResourceUpdate`  | `(resource: Resource) => void` | -                               | 资源更新回调     |
| `onResourceDelete`  | `(resourceId: string) => void` | -                               | 资源删除回调     |
| `onSceneReady`      | `(scene: Scene) => void`       | -                               | 场景就绪回调     |

### Resource 对象结构

```typescript
interface Resource {
  id: string; // 唯一标识符
  type: 'file' | 'link' | 'note' | 'custom'; // 资源类型
  name: string; // 资源名称
  shape: Shape; // 几何体形状
  position: {
    // 3D 空间位置
    x: number;
    y: number;
    z: number;
  };
  rotation?: {
    // 旋转角度（可选）
    x: number;
    y: number;
    z: number;
  };
  scale?: {
    // 缩放比例（可选）
    x: number;
    y: number;
    z: number;
  };
  color: string; // 颜色（十六进制）
  metadata?: Record<string, any>; // 自定义元数据
}
```

### Shape 类型

```typescript
type Shape = 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane';
```

### Theme 对象结构

```typescript
interface Theme {
  background?: string; // 背景颜色
  grid?: string; // 网格颜色
  selection?: string; // 选中高亮颜色
  hover?: string; // 悬停高亮颜色
  ambient?: {
    // 环境光设置
    color: string;
    intensity: number;
  };
  directional?: {
    // 方向光设置
    color: string;
    intensity: number;
    position: { x: number; y: number; z: number };
  };
}
```

## 键盘快捷键

| 快捷键         | 功能          |
| -------------- | ------------- |
| `W/A/S/D`      | 移动相机      |
| `Q/E`          | 上升/下降     |
| `鼠标左键拖拽` | 旋转视角      |
| `鼠标右键拖拽` | 平移视角      |
| `鼠标滚轮`     | 缩放视角      |
| `Ctrl+点击`    | 多选          |
| `Delete`       | 删除选中资源  |
| `Ctrl+Z`       | 撤销          |
| `Ctrl+Y`       | 重做          |
| `F`            | 聚焦选中资源  |
| `G`            | 切换网格显示  |
| `Space`        | 暂停/恢复动画 |

## 高级用法

### 自定义几何体

```jsx
import { Infinicube, registerCustomShape } from 'infinicube';

// 注册自定义几何体
registerCustomShape('diamond', {
  geometry: new THREE.OctahedronGeometry(1),
  material: new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
  icon: '💎',
  name: '钻石',
});

// 在组件中使用
<Infinicube enabledShapes={['box', 'sphere', 'diamond']} />;
```

### 编程式控制

```jsx
import { Infinicube, useInfinicubeAPI } from 'infinicube';

function App() {
  const infinicubeRef = useRef();

  const handleAddResource = () => {
    const api = infinicubeRef.current;
    api.createResource({
      type: 'file',
      name: '新文件',
      shape: 'box',
      position: api.getCameraPosition(),
      color: '#FF0000',
    });
  };

  const handleFocusAll = () => {
    const api = infinicubeRef.current;
    api.focusAll();
  };

  return (
    <div>
      <button onClick={handleAddResource}>添加资源</button>
      <button onClick={handleFocusAll}>查看全部</button>
      <Infinicube ref={infinicubeRef} />
    </div>
  );
}
```

### 性能优化配置

```jsx
<Infinicube
  performance={{
    maxObjects: 10000, // 最大对象数
    lodDistance: [50, 100, 200], // LOD 距离阈值
    cullingDistance: 500, // 剔除距离
    shadowMapSize: 2048, // 阴影贴图大小
    antialias: true, // 抗锯齿
    pixelRatio: window.devicePixelRatio,
  }}
/>
```

## 示例项目

查看 [examples](./examples) 目录获取更多使用示例：

- [基础示例](./examples/basic) - 最简单的使用方式
- [文件管理器](./examples/file-manager) - 3D 文件管理系统
- [知识图谱](./examples/knowledge-graph) - 知识节点可视化
- [项目看板](./examples/project-board) - 3D 项目管理看板

## 浏览器兼容性

Infinicube 支持所有现代浏览器：

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

需要 WebGL 2.0 支持。

## 贡献指南

欢迎贡献代码！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

## 许可证

MIT © [Infinicube Team]

---

<div align="center">
  <p>用 ❤️ 打造，为了更好的资源管理体验</p>
</div>
