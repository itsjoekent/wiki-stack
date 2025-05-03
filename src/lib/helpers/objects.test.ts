import { describe, it, expect } from 'vitest';
import { deepFreeze } from './objects';

describe('deepFreeze', () => {
  it('should freeze a simple object', () => {
    const obj = { a: 1, b: 2 };
    const frozenObj = deepFreeze(obj);

    expect(Object.isFrozen(frozenObj)).toBe(true);
    expect(() => {
      // @ts-expect-error: Testing immutability
      frozenObj.a = 3;
    }).toThrow();
  });

  it('should deeply freeze nested objects', () => {
    const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
    const frozenObj = deepFreeze(obj);

    expect(Object.isFrozen(frozenObj)).toBe(true);
    expect(Object.isFrozen(frozenObj.b)).toBe(true);
    expect(Object.isFrozen(frozenObj.b.d)).toBe(true);

    expect(() => {
      // @ts-expect-error: Testing immutability
      frozenObj.b.c = 4;
    }).toThrow();
  });

  it('should handle arrays correctly', () => {
    const obj = { a: [1, 2, 3] };
    const frozenObj = deepFreeze(obj);

    expect(Object.isFrozen(frozenObj)).toBe(true);
    expect(Object.isFrozen(frozenObj.a)).toBe(true);

    expect(() => {
      frozenObj.a.push(4);
    }).toThrow();
  });

  it('should return the same object reference', () => {
    const obj = { a: 1 };
    const frozenObj = deepFreeze(obj);

    expect(frozenObj).toBe(obj);
  });

  it('should handle non-object values gracefully', () => {
    const obj = 42 as unknown as object; // Force a non-object value
    const frozenObj = deepFreeze(obj);

    expect(frozenObj).toBe(obj);
  });
});