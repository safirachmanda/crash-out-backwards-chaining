// =====================================================================
// Mesin inferensi backward chaining + Certainty Factor
//
// goals : daftar diagnosis (D) yang ingin dibuktikan
// wm    : working memory { G1: { answer: "yes" | "no", cf } }
//
// solve() menelusuri rule dari goal ke belakang. Premis fakta (F)
// ditelusuri lewat rule pembentuknya, premis gejala (G) dicari di working
// memory. Kalau belum ada, solve() berhenti dan mengembalikan gejala yang
// harus ditanyakan berikutnya (ask). Gejala yang sama tidak ditanya dua kali.
// =====================================================================
import { NODE, RULES_BY_THEN } from "./rules";

// CF gabungan = CF lama + CF baru x (1 - CF lama)
export const combineCF = (a, b) => a + b * (1 - a);

export function solve(goals, wm) {
  const rules = {}; // id rule -> { state: yes | no | active, cf, order, failedBy, premises }
  const nodes = {}; // id node -> { state: yes | no, cf, parts }
  let order = 0;
  let started = 0; // urutan rule mulai dicoba (untuk label "rule pertama / kedua dicoba")

  // gejala (G) dicek lebih dulu daripada fakta (F), seperti pada slide Zookeeper:
  // kalau gejalanya sudah gagal, fakta tidak perlu ditelusuri.
  const byType = (a, b) => (NODE[a].type === "G" ? 0 : 1) - (NODE[b].type === "G" ? 0 : 1);

  const evalRule = (r) => {
    const known = rules[r.id];
    if (known && known.state !== "active") return known;
    const start = known?.start ?? ++started;

    // premis fakta (F) yang sudah diketahui gagal -> rule langsung gugur,
    // gejala (G) milik rule ini tidak perlu ditanyakan lagi.
    const deadFact = r.if.find((p) => NODE[p].type !== "G" && nodes[p]?.state === "no");
    if (deadFact) {
      return (rules[r.id] = { state: "no", cf: 0, order: ++order, start, failedBy: deadFact, premises: [] });
    }

    const premises = [];
    for (const p of [...r.if].sort(byType)) {
      const res = evalNode(p);
      if (res.state === "ask") {
        rules[r.id] = { state: "active", start };
        return res;
      }
      if (res.state === "no") {
        // satu premis gagal -> rule gagal, premis sisanya tidak perlu ditanya
        return (rules[r.id] = { state: "no", cf: 0, order: ++order, start, failedBy: p, premises });
      }
      premises.push({ id: p, cf: res.cf });
    }
    // CF rule = CF pakar x min(CF seluruh premis)
    const cf = r.cf * Math.min(...premises.map((x) => x.cf));
    return (rules[r.id] = { state: "yes", cf, order: ++order, start, premises });
  };

  const evalNode = (id) => {
    if (nodes[id]) return nodes[id];

    if (NODE[id].type === "G") {
      const a = wm[id];
      if (!a) return { state: "ask", id };
      return (nodes[id] = a.answer === "yes" ? { state: "yes", cf: a.cf } : { state: "no", cf: 0 });
    }

    let cf = null;
    const parts = [];
    for (const r of RULES_BY_THEN[id]) {
      const res = evalRule(r);
      if (res.state === "ask") return res;
      if (res.state === "yes") {
        parts.push({ rule: r.id, cf: res.cf });
        cf = cf === null ? res.cf : combineCF(cf, res.cf);
      }
    }
    return (nodes[id] = cf === null ? { state: "no", cf: 0, parts } : { state: "yes", cf, parts });
  };

  let ask = null;
  let askGoal = null;
  for (const g of goals) {
    const res = evalNode(g);
    if (res.state === "ask") {
      ask = res.id;
      askGoal = g;
      break;
    }
  }
  return { rules, nodes, ask, askGoal };
}

// rule yang baru selesai diperiksa (yes/no) antara dua hasil solve
export function newlyResolved(before, after) {
  const done = (s) => s && (s.state === "yes" || s.state === "no");
  return Object.keys(after.rules)
    .filter((id) => done(after.rules[id]) && !done(before.rules[id]))
    .sort((a, b) => after.rules[a].order - after.rules[b].order);
}
