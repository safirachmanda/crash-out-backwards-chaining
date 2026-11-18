// Tata letak graf rule gaya slide Zookeeper:
// gejala (kotak merah, kiri) -> gerbang AND (rule) -> fakta / diagnosis (kotak putih, kanan)
import { NODE } from "./rules";

export const COLW = 400; // jarak antar kolom
export const X0 = 14;
export const SQW = 15; // lebar kotak node
export const SQH = 26; // tinggi kotak node
export const GW = 54; // lebar gerbang
export const GH = 58; // tinggi gerbang
export const GAP = 36; // jarak gerbang ke kotak output
const ROW = 64;
const PER_RULE = 86;

export function buildGraph(rules) {
  const byThen = {};
  rules.forEach((r) => (byThen[r.then] = byThen[r.then] || []).push(r));

  const seen = [];
  rules.forEach((r) =>
    [...r.if, r.then].forEach((id) => {
      if (!seen.includes(id)) seen.push(id);
    })
  );

  // kolom = jalur terpanjang dari gejala
  const level = {};
  const lv = (id) => {
    if (level[id] !== undefined) return level[id];
    if (NODE[id].type === "G") return (level[id] = 0);
    const ps = byThen[id].flatMap((r) => r.if.map(lv));
    return (level[id] = 1 + Math.max(...ps));
  };
  seen.forEach(lv);

  const maxL = Math.max(0, ...Object.values(level));
  const cols = Array.from({ length: maxL + 1 }, () => []);
  seen.forEach((id) => cols[level[id]].push(id));

  const h = (id) => Math.max(ROW, (byThen[id] ? byThen[id].length : 1) * PER_RULE);
  const y = {};
  cols[0].forEach((id, i) => (y[id] = i * ROW + ROW / 2));

  const spread = (ids) => {
    ids.sort((a, b) => y[a] - y[b]);
    let prev = null;
    ids.forEach((id) => {
      if (prev !== null) {
        const min = y[prev] + h(prev) / 2 + h(id) / 2;
        if (y[id] < min) y[id] = min;
      }
      prev = id;
    });
  };
  const up = () => {
    for (let L = 1; L <= maxL; L++) {
      cols[L].forEach((id) => {
        const ps = byThen[id].flatMap((r) => r.if);
        y[id] = ps.reduce((s, p) => s + y[p], 0) / ps.length;
      });
      spread(cols[L]);
    }
  };
  const users = {};
  rules.forEach((r) => r.if.forEach((p) => (users[p] = users[p] || []).push(r.then)));
  const down = () => {
    cols[0].forEach((id) => {
      const cs = users[id] || [];
      if (cs.length) y[id] = cs.reduce((s, c) => s + y[c], 0) / cs.length;
    });
    spread(cols[0]);
  };

  up();
  for (let i = 0; i < 3; i++) {
    down();
    up();
  }

  const top = Math.min(...seen.map((id) => y[id] - h(id) / 2));
  const shift = 60 - top;
  seen.forEach((id) => (y[id] += shift));

  const X = (L) => X0 + L * COLW;
  const nodes = {};
  seen.forEach((id) => (nodes[id] = { id, level: level[id], x: X(level[id]), y: y[id] }));

  // posisi gerbang dulu, jalur kabel dihitung sesudahnya
  const gates = [];
  rules.forEach((r) => {
    const sibs = byThen[r.then];
    const i = sibs.indexOf(r);
    const to = nodes[r.then];
    const cy = to.y + (i - (sibs.length - 1) / 2) * PER_RULE;
    gates.push({ rule: r, x: to.x - GAP - GW, cy, to });
  });

  // area terlarang untuk kabel panjang: node dan gerbang di kolom antara
  const blocks = [
    ...seen.map((id) => ({ col: level[id], top: nodes[id].y - 34, bottom: nodes[id].y + 46 })),
    ...gates.map((g) => ({ col: g.to.level, top: g.cy - 60, bottom: g.cy + GH / 2 + 8 })),
  ];
  const lanes = [];
  const pickLane = (sy, a, b) => {
    const mid = blocks.filter((k) => k.col > a && k.col < b);
    for (let off = 0; off < 3000; off += 8) {
      for (const ly of off === 0 ? [sy] : [sy + off, sy - off]) {
        if (ly < 8) continue;
        const clash = mid.some((k) => ly > k.top - 3 && ly < k.bottom + 3);
        const crowd = lanes.some((l) => Math.abs(l - ly) < 10);
        if (!clash && !crowd) {
          lanes.push(ly);
          return ly;
        }
      }
    }
    return sy;
  };

  // kabel paling atas diproses lebih dulu supaya urutan lajur tetap rapi
  const jobs = [];
  gates.forEach((gt) => gt.rule.if.forEach((p) => jobs.push({ gt, p, sy: nodes[p].y })));
  jobs.sort((m, n) => m.sy - n.sy);
  const paths = new Map();
  jobs.forEach(({ gt, p, sy }) => {
    const from = nodes[p];
    const bus = gt.x - 34; // garis tegak bersama, lalu satu garis masuk ke gerbang
    const sx = from.x + SQW;
    let d;
    if (gt.to.level - from.level > 1) {
      const ly = pickLane(sy, from.level, gt.to.level);
      const xj = X(from.level + 1) - GAP - GW - 60;
      d =
        ly === sy
          ? `M ${sx} ${sy} H ${bus} V ${gt.cy} H ${gt.x}`
          : `M ${sx} ${sy} H ${xj} V ${ly} H ${bus} V ${gt.cy} H ${gt.x}`;
    } else {
      d = `M ${sx} ${sy} H ${bus} V ${gt.cy} H ${gt.x}`;
    }
    paths.set(`${gt.rule.id}:${p}`, d);
  });

  gates.forEach((gt) => {
    gt.inputs = gt.rule.if.map((p) => ({ from: p, d: paths.get(`${gt.rule.id}:${p}`) }));
    gt.out = `M ${gt.x + GW} ${gt.cy} H ${gt.x + GW + 16} V ${gt.to.y} H ${gt.to.x}`;
  });

  const bottom = Math.max(...seen.map((id) => y[id] + h(id) / 2));
  return {
    nodes,
    gates,
    width: X(maxL) + SQW + 20 + 270,
    height: bottom + 70,
  };
}
