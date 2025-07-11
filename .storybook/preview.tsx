import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { Stage } from '../src/components/stage';
import '../src/index.css';

const withStage = (Story: React.ComponentType) => (
  <Stage>
    <Story />
  </Stage>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  decorators: [
    (Story, context) => {
      // 只为 3D 组件添加 Stage 装饰器
      if (context.title === 'Components/World' || context.title === 'Components/Infinicube') {
        return withStage(Story);
      }
      return <Story />;
    },
  ],
};

export default preview;
