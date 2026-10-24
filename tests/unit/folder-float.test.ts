import { describe, it, expect } from 'vitest';
import Matter from 'matter-js';

describe('FolderFloat Physics & Layout logic', () => {
  it('creates Matter engine and bodies properly', () => {
    const { Engine, Bodies, Composite } = Matter;
    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    expect(engine).toBeDefined();
    expect(engine.gravity.x).toBe(0);
    expect(engine.gravity.y).toBe(0);

    const body = Bodies.rectangle(100, 100, 80, 34, {
      restitution: 0.55,
      friction: 0,
      frictionAir: 0.08,
      inertia: Infinity,
    });
    expect(body.position.x).toBe(100);
    expect(body.position.y).toBe(100);

    Composite.add(engine.world, [body]);
    expect(engine.world.bodies.length).toBe(1);

    Composite.clear(engine.world, false, true);
    Engine.clear(engine);
    expect(engine.world.bodies.length).toBe(0);
  });

  it('normalizes skill items with labels and values', () => {
    const rawSkills = [
      'React',
      { label: 'Next.js', value: 'nextjs' },
      { name: 'TypeScript' },
      { skill: { name: 'PostgreSQL' }, proficiency: 'Expert' },
    ];

    const normalized = rawSkills.map((item, idx) => {
      if (typeof item === 'string') {
        return { label: item, value: item };
      }
      if ('label' in item) {
        return item;
      }
      const name = ('skill' in item && item.skill ? item.skill.name : (item as any).name) || `Skill-${idx}`;
      return { label: name, value: name };
    });

    expect(normalized).toEqual([
      { label: 'React', value: 'React' },
      { label: 'Next.js', value: 'nextjs' },
      { label: 'TypeScript', value: 'TypeScript' },
      { label: 'PostgreSQL', value: 'PostgreSQL' },
    ]);
  });

  it('calculates jitter correctly within [0, 1)', () => {
    const jitter = (i: number) => {
      const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 10; i++) {
      const val = jitter(i);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it('calculates row wrapping and positions based on spread', () => {
    const list = [
      { label: 'React', value: 'React' },
      { label: 'TypeScript', value: 'TypeScript' },
      { label: 'PostgreSQL', value: 'PostgreSQL' },
      { label: 'Docker', value: 'Docker' },
      { label: 'Tailwind CSS', value: 'Tailwind CSS' },
    ];

    const PAD = 28;
    const CHAR = 6.8;
    const GAP = 12;
    const ROW = 52;
    const spread = 180;
    const lift = 26;
    const tilt = 8;

    const rows: { items: { i: number; pw: number }[]; width: number }[] = [];
    let row: { i: number; pw: number }[] = [];
    let width = 0;

    list.forEach((item, i) => {
      const pw = PAD + item.label.length * CHAR;
      if (row.length && width + GAP + pw > spread * 2) {
        rows.push({ items: row, width });
        row = [];
        width = 0;
      }
      row.push({ i, pw });
      width += (row.length > 1 ? GAP : 0) + pw;
    });
    if (row.length) rows.push({ items: row, width });

    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows.every((r) => r.width <= spread * 2 + 50)).toBe(true);

    const pos: { x: number; y: number; r: number }[] = [];
    rows.forEach((r, ri) => {
      let x = -r.width / 2;
      r.items.forEach(({ i, pw }) => {
        pos[i] = {
          x: x + pw / 2,
          y: -lift - ri * ROW,
          r: tilt,
        };
        x += pw + GAP;
      });
    });

    expect(pos.length).toBe(list.length);
    pos.forEach((p) => {
      expect(p.y).toBeLessThan(0); // pills float above folder
      expect(typeof p.x).toBe('number');
    });
  });
});
