import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stage } from '../src/components/stage';
import { World } from '../src/components/world';
import { Cube } from '../src/components/cube';
import type { Cube as CubeData } from '../src/components/infinicube';

const meta: Meta<typeof Cube> = {
  title: 'Components/Cube',
  component: Cube,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Cube 组件文档

## 是什么

Cube 是 Infinicube 组件库的基础 3D 元素组件，代表一个可交互的立方体。它基于 @react-three/drei 的 Box 组件构建，提供了颜色配置、尺寸调整、选中状态等功能。

## 为什么

- **简单易用**：通过简单的属性配置即可创建立方体
- **交互支持**：内置点击事件处理和选中状态反馈
- **性能优化**：使用 React Three Fiber 的优化渲染
- **视觉反馈**：选中时的发光效果提升用户体验
- **灵活配置**：支持自定义颜色、尺寸和位置

## 谁在用

- 使用 Infinicube 组件创建 3D 场景的开发者
- 需要展示 3D 数据点或对象的应用
- 构建 3D 编辑器或设计工具的团队
- 学习 React Three Fiber 的初学者

## 何时用

- 需要在 3D 空间中表示对象或数据点
- 创建可交互的 3D 元素
- 构建 3D 可视化系统的基础单元
- 展示空间数据或 3D 模型的组成部分

## 在哪用

- 作为 Infinicube 组件管理的基础元素
- 3D 数据可视化中的数据点
- 3D 编辑器中的基础形状
- 游戏或仿真中的对象表示
- 教学演示中的几何体展示

## 如何用

### 依赖关系

\`\`\`
Stage (容器层)
  └── World (场景层)
        └── Infinicube (管理层)
              └── Cube (元素层)
\`\`\`

### API 接口

\`\`\`typescript
interface CubeProps {
  cube: {
    id: string;
    position: [number, number, number];
    color?: string;
    size?: number;
  };
  isSelected?: boolean;
  onClick?: (cube: CubeData) => void;
}
\`\`\`

### Props 说明

- **cube**: 立方体数据对象
  - **id**: 唯一标识符
  - **position**: 3D 空间位置 [x, y, z]
  - **color**: 颜色值，支持十六进制格式，默认 "#3b82f6"
  - **size**: 立方体大小，默认 1
- **isSelected**: 是否为选中状态，选中时显示发光效果
- **onClick**: 点击事件回调函数

### 视觉效果

#### 默认状态
- 标准材质 (Standard Material)
- 支持光照和阴影
- 金属度: 0.1，粗糙度: 0.5

#### 选中状态
- 发光颜色: 使用立方体自身颜色
- 发光强度: 0.3
- 缩放动画: 平滑过渡到 1.1 倍大小

## 使用示例

### 基础用法

\`\`\`jsx
const cubeData = {
  id: 'cube-1',
  position: [0, 0, 0],
  color: '#3b82f6',
  size: 1
};

<Cube 
  cube={cubeData}
  isSelected={false}
  onClick={(cube) => console.log('Clicked:', cube)}
/>
\`\`\`

### 选中状态

\`\`\`jsx
<Cube 
  cube={cubeData}
  isSelected={true}
  onClick={handleCubeClick}
/>
\`\`\`

### 自定义样式

\`\`\`jsx
const customCube = {
  id: 'custom-cube',
  position: [2, 1, -1],
  color: '#ef4444',  // 红色
  size: 2            // 2倍大小
};

<Cube cube={customCube} />
\`\`\`

### 注意事项

1. **颜色格式**：确保使用有效的十六进制颜色值
2. **位置坐标**：使用 Three.js 的右手坐标系
3. **性能考虑**：大量立方体时注意使用实例化技术
4. **交互体验**：确保立方体大小适合点击操作
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    cube: {
      description: '立方体数据对象',
      control: 'object',
      table: {
        type: {
          summary: 'CubeData',
          detail: `{
  id: string;
  position: [number, number, number];
  color?: string;
  size?: number;
}`,
        },
      },
    },
    isSelected: {
      description: '是否选中状态',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      description: '点击事件回调',
      action: 'clicked',
      table: {
        type: { summary: '(cube: CubeData) => void' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCube: CubeData = {
  id: 'story-cube',
  position: [0, 0, 0],
  color: '#3b82f6',
  size: 1,
};

export const Default: Story = {
  name: '默认立方体',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: defaultCube,
    isSelected: false,
  },
};

export const Selected: Story = {
  name: '选中状态',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: defaultCube,
    isSelected: true,
  },
};

export const Large: Story = {
  name: '大型立方体',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      size: 2,
      color: '#ef4444',
    },
    isSelected: false,
  },
};

export const Small: Story = {
  name: '小型立方体',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      size: 0.5,
      color: '#10b981',
    },
    isSelected: false,
  },
};

export const CustomColor: Story = {
  name: '自定义颜色',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      color: '#f59e0b',
    },
    isSelected: false,
  },
};

export const PositionedCube: Story = {
  name: '定位立方体',
  render: (args) => (
    <Stage>
      <World>
        <Cube {...args} />
      </World>
    </Stage>
  ),
  args: {
    cube: {
      ...defaultCube,
      position: [2, 1, -1],
      color: '#8b5cf6',
    },
    isSelected: false,
  },
};
