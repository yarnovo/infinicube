import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Infinicube } from '../src/components/infinicube';

const meta = {
  title: 'Components/Infinicube',
  component: Infinicube,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Infinicube 组件文档

## 简介

Infinicube 是一个基于 React Three Fiber 的 3D 资源管理组件，提供了在 3D 空间中创建、选择和管理立方体的能力。

## 核心功能

- **创建立方体**: 在任意 3D 坐标位置创建立方体
- **选择立方体**: 点击选中立方体，带有视觉反馈
- **删除立方体**: 删除指定的立方体
- **批量管理**: 清空所有立方体
- **事件回调**: 完整的生命周期事件

## API 接口

### 命令式 API (通过 ref)

\`\`\`typescript
interface InfinicubeRef {
  createCube: (position: [number, number, number], options?: { color?: string; size?: number }) => string;
  selectCube: (id: string) => void;
  deleteCube: (id: string) => void;
  getCubes: () => Cube[];
  clearCubes: () => void;
}
\`\`\`

### Props

\`\`\`typescript
interface InfinicubeProps extends WorldProps {
  initialCubes?: Cube[];
  onCubeCreate?: (cube: Cube) => void;
  onCubeSelect?: (cube: Cube | null) => void;
  onCubeDelete?: (id: string) => void;
  onCubeUpdate?: (cube: Cube) => void;
}
\`\`\`

## 使用示例

\`\`\`jsx
import { useRef } from 'react';
import { Infinicube } from '@infinicube/components';

function App() {
  const infinicubeRef = useRef(null);
  
  const handleCreateCube = () => {
    const position = [Math.random() * 4 - 2, 1, Math.random() * 4 - 2];
    infinicubeRef.current?.createCube(position);
  };
  
  return (
    <>
      <button onClick={handleCreateCube}>创建立方体</button>
      <Infinicube
        ref={infinicubeRef}
        onCubeSelect={(cube) => console.log('Selected:', cube)}
      />
    </>
  );
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialCubes: {
      description: '初始立方体数组',
      control: 'object',
    },
    onCubeCreate: {
      description: '立方体创建时的回调',
      action: 'cube-created',
    },
    onCubeSelect: {
      description: '立方体选中时的回调',
      action: 'cube-selected',
    },
    onCubeDelete: {
      description: '立方体删除时的回调',
      action: 'cube-deleted',
    },
    onCubeUpdate: {
      description: '立方体更新时的回调',
      action: 'cube-updated',
    },
    showGrid: {
      control: 'boolean',
      description: '是否显示网格',
      defaultValue: true,
    },
    showStats: {
      control: 'boolean',
      description: '是否显示性能统计',
      defaultValue: false,
    },
  },
} satisfies Meta<typeof Infinicube>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showGrid: true,
    showStats: false,
    onCubeCreate: fn(),
    onCubeSelect: fn(),
    onCubeDelete: fn(),
  },
};

export const WithInitialCubes: Story = {
  name: '预设立方体',
  args: {
    ...Default.args,
    initialCubes: [
      { id: 'cube-1', position: [-2, 1, 0], color: '#ff6b6b', size: 1 },
      { id: 'cube-2', position: [0, 1, 0], color: '#4ecdc4', size: 1.5 },
      { id: 'cube-3', position: [2, 1, 0], color: '#45b7d1', size: 0.8 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '展示如何使用 initialCubes 属性预设一些立方体',
      },
    },
  },
};

export const GridPattern: Story = {
  name: '网格排列',
  args: {
    ...Default.args,
    initialCubes: Array.from({ length: 25 }, (_, i) => ({
      id: `grid-cube-${i}`,
      position: [(i % 5) * 1.5 - 3, 0.5, Math.floor(i / 5) * 1.5 - 3] as [number, number, number],
      color: `hsl(${(i * 360) / 25}, 70%, 50%)`,
      size: 0.8,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: '展示立方体的网格排列，使用彩虹色渐变',
      },
    },
  },
};
