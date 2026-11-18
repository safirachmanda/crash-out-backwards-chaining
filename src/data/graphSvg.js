// Menggambar graf rule bergaya slide Zookeeper sebagai string SVG.
// Dipakai oleh komponen RuleGraph (aplikasi) dan generator PDF, jadi tampilannya sama.
import { NODE, SYMPTOMS, fmtCF, pct } from "./rules";
import { buildGraph, SQW, SQH, GW, GH } from "./graphLayout";

const RED = "#c00000";
const PINK = "#ff66cc";
const PINK_TEXT = "#c2187f";
const BLUE = "#1a1ab0";
const INK = "#000";
const GREY = "#9aa8a0";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ORD = ["pertama", "kedua", "ketiga", "keempat", "kelima", "keenam", "ketujuh", "kedelapan", "kesembilan", "kesepuluh", "kesebelas", "kedua belas", "ketiga belas", "keempat belas"];
const orderLabel = (n) => (n === 1 ? "Rule pertama dipakai" : n === 2 ? "Rule kedua dicoba" : `Rule ${ORD[n - 1] || "ke-" + n}`);

// pecah label panjang jadi dua baris di spasi yang paling dekat ke tengah
function wrap(t, max = 22) {
  if (t.length <= max) return [t];
  let best = -1;
  for (let i = 0; i < t.length; i++) if (t[i] === " " && (best < 0 || Math.abs(i - t.length / 2) < Math.abs(best - t.length / 2))) best = i;
  return best < 0 ? [t] : [t.slice(0, best), t.slice(best + 1)];
}

const gatePath = `M0,0 H${GW * 0.45} C${GW * 1.18},0 ${GW * 1.18},${GH} ${GW * 0.45},${GH} H0 Z`;

export function renderGraphSvg(rules, sol, wm) {
  const g = buildGraph(rules);
  const nodeState = (id) => {
    if (NODE[id].type === "G") {
      const a = wm[id];
      return a ? (a.answer === "yes" ? "yes" : "no") : "idle";
    }
    const n = sol.nodes[id];
    return n ? n.state : "idle";
  };
  const gateState = (id) => sol.rules[id]?.state || "idle";

  // gaya kabel mengikuti slide: tebal hitam = dipakai, titik-titik hitam = rule gagal
  const wireOf = (gate) => {
    const gs = gateState(gate);
    if (gs === "yes") return { prio: 2, a: `stroke="${INK}" stroke-width="3"` };
    if (gs === "no") return { prio: 1, a: `stroke="${INK}" stroke-width="3" stroke-dasharray="1 8"` };
    return { prio: 0, a: `stroke="${GREY}" stroke-width="1.8"` };
  };

  const wires = [];
  g.gates.forEach((gt) => {
    const w = wireOf(gt.rule.id);
    gt.inputs.forEach((inp) => wires.push({ prio: w.prio, d: inp.d, a: w.a }));
    wires.push({ prio: w.prio, d: gt.out, a: w.a });
  });
  wires.sort((a, b) => a.prio - b.prio);

  const halo = 'stroke="#fff" stroke-width="4" stroke-linejoin="round" paint-order="stroke"';
  const text = (x, y, size, weight, fill, t, anchor) =>
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" ${anchor ? `text-anchor="${anchor}"` : ""} ${halo}>${esc(t)}</text>`;

  let o = `<svg xmlns="http://www.w3.org/2000/svg" class="rule-graph" viewBox="0 0 ${g.width} ${g.height}" width="${g.width}" height="${g.height}" font-family="Arial, Helvetica, 'DejaVu Sans', sans-serif" role="img" aria-label="Graf rule backward chaining">`;

  wires.forEach((w) => {
    o += `<path d="${w.d}" fill="none" ${w.a} stroke-linecap="round" stroke-linejoin="round"/>`;
  });

  // gerbang AND = rule
  g.gates.forEach((gt) => {
    const res = sol.rules[gt.rule.id];
    const st = gateState(gt.rule.id);
    const used = st === "yes" || st === "no";
    const gy = gt.cy - GH / 2;
    o += `<g transform="translate(${gt.x},${gy})">`;
    o += `<title>${esc(`${gt.rule.id}: IF ${gt.rule.if.join(" AND ")} THEN ${gt.rule.then} (CF pakar ${fmtCF(gt.rule.cf)})` + (st === "yes" ? ` -> YA, CF ${fmtCF(res.cf)}` : st === "no" ? " -> gagal" : ""))}</title>`;
    o += `<path d="${gatePath}" fill="${used ? RED : "#fff"}" stroke="${used ? RED : INK}" stroke-width="2"/>`;
    o += `<text x="${GW * 0.42}" y="${GH / 2 + 9}" text-anchor="middle" font-size="26" font-weight="700" fill="${used ? "#fff" : INK}">R${gt.rule.id.slice(1)}</text>`;
    if (res && res.start) o += text(GW + 6, -9, 20, 700, BLUE, orderLabel(res.start), "end");
    o += `</g>`;
  });

  // node: gejala (kotak merah), fakta dan diagnosis (kotak putih)
  Object.values(g.nodes).forEach((n) => {
    const type = NODE[n.id].type;
    const st = nodeState(n.id);
    const a = wm[n.id];
    const res = sol.nodes[n.id];
    const label = `${n.id} ${NODE[n.id].short}`;
    const full = type === "G" ? SYMPTOMS[n.id].question : NODE[n.id].name;
    const fill = type === "G" ? (st === "yes" ? RED : st === "no" ? PINK : "#fff") : "#fff";
    const stroke = type === "G" ? (st === "yes" ? RED : st === "no" ? PINK : INK) : INK;
    o += `<g><title>${esc(full)}</title>`;
    o += `<rect x="${n.x}" y="${n.y - SQH / 2}" width="${SQW}" height="${SQH}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    const tx = n.x + SQW + 10;
    if (type === "G") {
      o += text(tx, n.y - 9, 17, 400, INK, label);
      if (st === "yes") o += text(tx, n.y + 17, 13, 700, RED, `Ya · CF user ${fmtCF(a.cf)}`);
      if (st === "no") o += text(tx, n.y + 17, 13, 700, PINK_TEXT, "Tidak");
    } else if (type === "F") {
      const lines = wrap(label);
      lines.forEach((ln, i) => (o += text(tx - 2, n.y - 8 - (lines.length - 1 - i) * 19, 17, 400, INK, ln)));
      if (res && res.state === "yes") o += text(tx - 2, n.y + 18, 13, 700, RED, `CF ${fmtCF(res.cf)} (${pct(res.cf)}%)`);
      if (res && res.state === "no") o += text(tx - 2, n.y + 18, 13, 700, PINK_TEXT, "Tidak terbukti");
    } else {
      // diagnosis = kartu output, tulisan di bawah kotak seperti "Is a cheetah" pada slide
      wrap(label, 26).forEach((ln, i) => (o += text(n.x - 4, n.y + SQH / 2 + 24 + i * 22, 20, 700, INK, ln)));
      const k = wrap(label, 26).length;
      if (res && res.state === "yes") o += text(n.x - 4, n.y + SQH / 2 + 24 + k * 22, 14, 700, RED, `CF ${fmtCF(res.cf)} (${pct(res.cf)}%)`);
      if (res && res.state === "no") o += text(n.x - 4, n.y + SQH / 2 + 24 + k * 22, 14, 700, PINK_TEXT, "Tidak terbukti");
    }
    o += `</g>`;
  });

  return o + "</svg>";
}
