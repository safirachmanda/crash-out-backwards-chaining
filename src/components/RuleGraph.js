import { useMemo } from "react";
import { renderGraphSvg } from "../data/graphSvg";

/* Graf rule bergaya slide Zookeeper.
   Merah = gejala terbukti (Ya), pink = tidak, putih = belum diperiksa.
   Garis tebal = rule dipakai, garis titik-titik = rule dicoba tapi gagal.
   Tulisan biru = urutan rule dicoba. */
function RuleGraph({ rules, sol, wm }) {
  const svg = useMemo(() => renderGraphSvg(rules, sol, wm), [rules, sol, wm]);
  return <div className="graph-wrap" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default RuleGraph;
