import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Stage } from '../src/components/stage';

describe('Stage Component DOM Tests', () => {
  it('should render DOM container with default props', () => {
    const { container } = render(
      <Stage>
        <mesh />
      </Stage>
    );

    const wrapper = container.firstChild as HTMLDivElement;
    expect(wrapper).toBeDefined();
    expect(wrapper.tagName).toBe('DIV');
    expect(wrapper.style.width).toBe('100%');
    expect(wrapper.style.height).toBe('600px');
    expect(wrapper.style.backgroundColor).toBe('rgb(240, 240, 240)');
  });

  it('should apply custom dimensions', () => {
    const { container } = render(
      <Stage width="800px" height="400px" backgroundColor="#000000">
        <mesh />
      </Stage>
    );

    const wrapper = container.firstChild as HTMLDivElement;
    expect(wrapper.style.width).toBe('800px');
    expect(wrapper.style.height).toBe('400px');
    expect(wrapper.style.backgroundColor).toBe('rgb(0, 0, 0)');
  });

  it('should handle numeric dimensions', () => {
    const { container } = render(
      <Stage width={500} height={300}>
        <mesh />
      </Stage>
    );

    const wrapper = container.firstChild as HTMLDivElement;
    expect(wrapper.style.width).toBe('500px');
    expect(wrapper.style.height).toBe('300px');
  });

  it('should render Canvas element inside', () => {
    const { container } = render(
      <Stage>
        <mesh />
      </Stage>
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
  });
});
