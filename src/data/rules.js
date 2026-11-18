// =====================================================================
// Basis pengetahuan Crash-Out, mengikuti PERSIS pola rule Zookeeper (Z1-Z14):
//   14 rule, 4 fakta antara (F), 6 diagnosis (D).
//
//   Zookeeper                       Crash-Out
//   Z1,Z2  mammal   (1 premis)  ->  R1,R2   F1 Suhu berlebih
//   Z3,Z4  bird     (1 / 2 G)   ->  R3,R4   F2 Sistem atau file bermasalah
//   Z5,Z6  carnivore (mammal+)  ->  R5,R6   F3 Pendinginan tidak efektif
//   Z7,Z8  ungulate  (mammal+)  ->  R7,R8   F4 Gangguan tampilan saat suhu tinggi
//   Z9,Z10 cheetah, tiger       ->  R9,R10  D1 Overheating, D2 Thermal Paste
//   Z11,Z12 giraffe, zebra      ->  R11,R12 D3 Graphic Glitch, D4 Kerusakan GPU/VRAM
//   Z13,Z14 ostrich, penguin    ->  R13,R14 D5 Blue Screen, D6 Corrupted Install
//
// Gejala yang dipakai bersama mengikuti Zookeeper juga:
//   tawny color G4 (Z9,Z10), dark spots G6 (Z9,Z11), black stripes G8 (Z10,Z12),
//   long legs G11 dan long neck G16 (Z11,Z13), does not fly G10 (Z13,Z14).
// Satu fakta bisa dibentuk beberapa rule (OR, CF digabung) dan satu fakta
// dipakai banyak rule sesudahnya (F1 dipakai R5-R8, F3 dipakai R9-R10, dst).
// Nilai CF pakar adalah nilai usulan dan perlu divalidasi pakar atau dosen.
// =====================================================================

export const CATEGORIES = [
  { id: "overheating", name: "Overheating", desc: "CPU atau GPU panas, kipas berisik, performa lambat", goals: ["D1"] },
  { id: "thermalpaste", name: "Thermal Paste", desc: "Suhu tetap tinggi walau dipakai ringan, sudah lama tidak diservis", goals: ["D2"] },
  { id: "bluescreen", name: "Blue Screen", desc: "Crash mendadak dan kode error (BSOD)", goals: ["D5"] },
  { id: "glitch", name: "Graphic Glitch", desc: "Artefak, layar berkedip, atau tampilan rusak", goals: ["D3"] },
  { id: "gpuvram", name: "Kerusakan GPU/VRAM", desc: "Artefak muncul sampai di BIOS atau layar booting", goals: ["D4"] },
  { id: "corrupted", name: "Corrupted Install", desc: "File rusak saat install aplikasi", goals: ["D6"] },
];

// Pilihan jawaban memakai kata, bukan skala angka. CF tiap pilihan dihitung
// dari urutannya: makin ke bawah makin kuat (4 pilihan = 0,4 / 0,6 / 0,8 / 1,0).
const cfAt = (i, n) => Math.round((1 - 0.2 * (n - 1 - i)) * 10) / 10;
const S = (question, levelQ, opts, hint) => ({
  question,
  hint,
  levelQ,
  options: opts.map(([label, sub], i) => ({ label, sub, cf: cfAt(i, opts.length) })),
});
const FREQ5 = [["Jarang"], ["Kadang-kadang"], ["Cukup sering"], ["Sering"], ["Hampir selalu"]];
const AFTER = [
  ["Tidak yakin, mungkin berhubungan"],
  ["Mulai beberapa hari setelahnya"],
  ["Mulai tepat setelahnya"],
  ["Sebelumnya tidak pernah, sejak itu selalu muncul"],
];

// ---------- Gejala (G) ----------
export const SYMPTOMS = {
  G1: { short: "Suhu CPU/GPU tinggi", ...S(
    "Apakah suhu CPU atau GPU terasa atau terbaca tinggi saat PC dipakai?",
    "Seberapa tinggi suhunya?",
    [["Menengah", "Hangat, sekitar 60 sampai 70°C"], ["Cukup tinggi", "Mulai panas, sekitar 70 sampai 78°C"], ["Tinggi", "Panas, sekitar 78 sampai 85°C"], ["Sangat tinggi", "Di atas 85°C, atau merah di aplikasi monitor"]]) },
  G2: { short: "Kipas berputar keras", ...S(
    "Apakah kipas PC-mu berbunyi sangat keras?",
    "Seberapa keras bunyi kipasnya?",
    [["Terdengar jelas", "Mulai terdengar dari dekat"], ["Cukup keras", "Mengganggu di ruangan sepi"], ["Keras", "Berisik dan berputar kencang terus"], ["Sangat keras", "Seperti mesin, terdengar dari jauh"]]) },
  G3: { short: "Lag setelah menyala lama", ...S(
    "Apakah PC jadi lambat atau lag setelah menyala beberapa lama?",
    "Seberapa sering itu terjadi?", FREQ5) },
  G4: { short: "PC mati / restart sendiri", ...S(
    "Apakah PC pernah mati atau restart sendiri tanpa peringatan?",
    "Seberapa sering PC mati atau restart sendiri?",
    [["Beberapa kali"], ["Cukup sering"], ["Sering"], ["Hampir setiap dipakai lama"]]) },
  G5: { short: "Bodi terasa panas", ...S(
    "Apakah bodi laptop atau casing PC terasa panas saat disentuh?",
    "Seberapa panas bodinya?",
    [["Hangat", "Terasa hangat tapi nyaman"], ["Cukup panas", "Mulai kurang nyaman disentuh"], ["Panas", "Tidak nyaman disentuh lama"], ["Sangat panas", "Tidak tahan menyentuhnya"]]) },
  G6: { short: "Ventilasi tertutup/berdebu", ...S(
    "Apakah lubang ventilasi tertutup atau berdebu?",
    "Seberapa parah debu atau sumbatannya?",
    [["Sedikit berdebu", "Masih terlihat cukup bersih"], ["Cukup berdebu", "Debu tipis menempel di lubang ventilasi"], ["Berdebu tebal", "Lubang ventilasi mulai tersumbat"], ["Tersumbat", "Hampir tertutup debu atau terhalang benda"]]) },
  G7: { short: "Suhu tinggi saat ringan", ...S(
    "Apakah suhu tetap tinggi walau PC hanya dipakai ringan (misalnya browsing atau didiamkan)?",
    "Seberapa sering suhunya tetap tinggi saat beban ringan?", FREQ5) },
  G8: { short: "Usia >2 th, belum servis", ...S(
    "Apakah perangkat sudah dipakai lebih dari 2 tahun tanpa pernah diservis atau dibersihkan?",
    "Sudah berapa lama sejak terakhir diservis?",
    [["Sekitar 2 tahun"], ["Sekitar 3 tahun"], ["Sekitar 4 tahun"], ["Lebih dari 4 tahun atau belum pernah"]]) },
  G9: { short: "BSOD sering muncul", ...S(
    "Apakah layar biru (BSOD) sering muncul?",
    "Seberapa sering layar biru muncul?",
    [["Sesekali", "Beberapa kali dalam sebulan"], ["Cukup sering", "Beberapa kali dalam seminggu"], ["Sering", "Hampir setiap hari"], ["Berkali-kali", "Beberapa kali dalam sehari"]]) },
  G10: { short: "Ada kode error tertulis", ...S(
    "Apakah ada kode error tertulis saat layar biru muncul atau saat instalasi gagal?",
    "Seberapa jelas kode error-nya terbaca?",
    [["Terlihat sekilas", "Belum sempat dicatat"], ["Terbaca sebagian"], ["Terbaca jelas"], ["Terbaca jelas dan selalu sama"]],
    "Huruf kapital seperti MEMORY_MANAGEMENT.") },
  G11: { short: "Setelah driver/update", ...S(
    "Apakah masalah mulai muncul setelah memasang driver atau update sistem?",
    "Seberapa dekat masalahnya dengan waktu pemasangan itu?", AFTER) },
  G12: { short: "Baca file lambat/error", ...S(
    "Apakah proses membaca file sangat lambat atau sering error?",
    "Seberapa sering itu terjadi?",
    [["Sesekali"], ["Cukup sering"], ["Sering"], ["Hampir selalu"]]) },
  G13: { short: "Artefak di layar", ...S(
    "Apakah muncul artefak atau gangguan visual di layar?",
    "Seberapa banyak artefaknya?",
    [["Sedikit", "Sesekali muncul titik atau garis"], ["Cukup banyak", "Terlihat jelas di beberapa area"], ["Banyak", "Mengganggu pemakaian"], ["Hampir memenuhi layar"]],
    "Titik, garis, atau kotak warna yang tidak seharusnya ada.") },
  G14: { short: "Layar berkedip", ...S(
    "Apakah layar berkedip?",
    "Seberapa sering layar berkedip?",
    [["Sesekali"], ["Cukup sering"], ["Sering"], ["Terus-menerus"]]) },
  G15: { short: "Makin parah saat game/video", ...S(
    "Apakah performa atau tampilan makin parah saat bermain game atau memutar video?",
    "Seberapa parah bedanya?",
    [["Sedikit lebih parah"], ["Cukup lebih parah"], ["Jauh lebih parah"], ["Hampir tidak bisa dipakai"]]) },
  G16: { short: "Layar freeze / hitam", ...S(
    "Apakah layar freeze atau hitam sesaat lalu pulih lagi?",
    "Seberapa sering itu terjadi?",
    [["Sesekali"], ["Cukup sering"], ["Sering"], ["Berkali-kali dalam sehari"]]) },
  G17: { short: "Artefak di BIOS/boot", ...S(
    "Apakah artefak juga terlihat di BIOS atau layar booting?",
    "Seberapa jelas artefaknya di sana?",
    [["Samar, tidak yakin"], ["Terlihat sedikit"], ["Terlihat jelas"], ["Sangat jelas, sama seperti di Windows"]],
    "Tampil sebelum Windows menyala.") },
  G18: { short: "Pesan file install rusak", ...S(
    "Apakah muncul pesan bahwa file instalasi rusak?",
    "Seberapa jelas pesan errornya?",
    [["Error umum, tidak menyebut file rusak"], ["Menyebut file mungkin rusak"], ["Menyebut CRC error atau archive corrupted"], ["Muncul berulang di beberapa installer"]],
    "Misalnya \"CRC error\" atau \"archive is corrupted\".") },
  G19: { short: "Gagal di tahap yang sama", ...S(
    "Apakah instalasi gagal di tahap yang sama?",
    "Seberapa sering gagalnya di tahap yang sama?",
    [["Sesekali"], ["Cukup sering"], ["Sering"], ["Selalu"]]) },
  G20: { short: "Error baca file lain", ...S(
    "Apakah muncul error saat membaca file lain di drive yang sama?",
    "Seberapa sering errornya muncul?",
    [["Sesekali"], ["Cukup sering"], ["Sering"], ["Hampir selalu"]]) },
};

// ---------- Fakta antara (F) ----------
export const FACTS = {
  F1: { short: "Suhu berlebih", name: "Suhu berlebih" },
  F2: { short: "Sistem atau file bermasalah", name: "Sistem atau file bermasalah" },
  F3: { short: "Pendinginan tidak efektif", name: "Pendinginan tidak efektif" },
  F4: { short: "Gangguan tampilan saat panas", name: "Gangguan tampilan saat suhu tinggi" },
};

// ---------- Diagnosis (D) + rekomendasi ----------
// Nama diagnosis = nama kartu masalah di halaman diagnosa. Kartu itu adalah OUTPUT.
export const DIAGNOSES = {
  D1: {
    cat: "overheating", short: "Overheating", name: "Overheating",
    solutions: [
      "Matikan PC, lalu bersihkan debu di kipas, ventilasi, dan heatsink pakai compressed air atau kuas halus.",
      "Pastikan lubang ventilasi tidak tertutup. Untuk laptop, pakai cooling pad dan taruh di permukaan keras.",
      "Rapikan kabel di dalam casing supaya aliran udara lancar.",
    ],
  },
  D2: {
    cat: "thermalpaste", short: "Thermal Paste", name: "Thermal Paste",
    solutions: [
      "Ganti thermal paste CPU/GPU, terutama kalau perangkat sudah lebih dari 2 sampai 3 tahun.",
      "Kalau belum biasa membongkar perangkat, serahkan ke teknisi.",
      "Pantau suhu sebelum dan sesudah penggantian untuk memastikan ada penurunan.",
    ],
  },
  D3: {
    cat: "glitch", short: "Graphic Glitch", name: "Graphic Glitch",
    solutions: [
      "Bersihkan debu dari kipas dan heatsink GPU, lalu cek aliran udara di casing.",
      "Naikkan kurva kipas GPU atau turunkan pengaturan grafis dan batasi FPS.",
      "Kalau suhu tetap tinggi, ganti thermal paste atau thermal pad GPU.",
    ],
  },
  D4: {
    cat: "gpuvram", short: "Kerusakan GPU/VRAM", name: "Kerusakan GPU/VRAM",
    solutions: [
      "Coba kabel display, port, atau monitor lain untuk memastikan bukan masalah kabel.",
      "Pasang ulang GPU di slot-nya dan reset BIOS ke default.",
      "Karena artefak juga muncul di BIOS, GPU atau VRAM rusak. Bawa ke teknisi untuk diperbaiki atau diganti.",
    ],
  },
  D5: {
    cat: "bluescreen", short: "Blue Screen", name: "Blue Screen",
    solutions: [
      "Catat kode stop di layar biru lalu cari di internet, biasanya langsung menunjuk penyebabnya.",
      "Rollback atau uninstall driver atau update terakhir yang dipasang sebelum crash mulai terjadi.",
      "Kalau PC tidak stabil, masuk Safe Mode dulu lalu pasang driver resmi dari situs vendor.",
    ],
  },
  D6: {
    cat: "corrupted", short: "Corrupted Install", name: "Corrupted Install",
    solutions: [
      "Jalankan 'sfc /scannow' dan 'chkdsk' di Command Prompt (admin).",
      "Cek kesehatan SSD/HDD dengan CrystalDiskInfo. Ganti disk kalau statusnya Caution atau Bad.",
      "Backup data penting sekarang, lalu download ulang installer dari situs resmi dan coba install lagi.",
    ],
  },
};

// ---------- Rule (pola Zookeeper Z1-Z14) ----------
// if   : premis (AND). G = gejala, F = fakta antara
// then : kesimpulan (F atau D)
// cf   : CF pakar (nilai usulan, perlu divalidasi pakar atau dosen)
// Beberapa rule dengan "then" yang sama = alternatif (OR), CF-nya digabung.
export const RULES = [
  // Z1  If has hair                      Then mammal
  { id: "R1",  if: ["G1"],                       then: "F1", cf: 0.8 },
  // Z2  If gives milk                    Then mammal
  { id: "R2",  if: ["G5"],                       then: "F1", cf: 0.7 },
  // Z3  If has feathers                  Then bird
  { id: "R3",  if: ["G9"],                       then: "F2", cf: 0.7 },
  // Z4  If flies and lays eggs           Then bird
  { id: "R4",  if: ["G18", "G19"],               then: "F2", cf: 0.8 },
  // Z5  If mammal and eats meat          Then carnivore
  { id: "R5",  if: ["F1", "G7"],                 then: "F3", cf: 0.8 },
  // Z6  If mammal and pointed teeth and claws and forward-pointed eyes   Then carnivore
  { id: "R6",  if: ["F1", "G2", "G3", "G15"],    then: "F3", cf: 0.7 },
  // Z7  If mammal and hoofs              Then ungulate
  { id: "R7",  if: ["F1", "G13"],                then: "F4", cf: 0.8 },
  // Z8  If mammal and chews cud          Then ungulate
  { id: "R8",  if: ["F1", "G14"],                then: "F4", cf: 0.6 },
  // Z9  If carnivore and tawny color and dark spots          Then cheetah
  { id: "R9",  if: ["F3", "G4", "G6"],           then: "D1", cf: 0.9 },
  // Z10 If carnivore and tawny color and black stripes       Then tiger
  { id: "R10", if: ["F3", "G4", "G8"],           then: "D2", cf: 0.8 },
  // Z11 If ungulate and long legs and long neck and dark spots   Then giraffe
  { id: "R11", if: ["F4", "G11", "G16", "G6"],   then: "D3", cf: 0.8 },
  // Z12 If ungulate and white color and black stripes        Then zebra
  { id: "R12", if: ["F4", "G17", "G8"],          then: "D4", cf: 0.9 },
  // Z13 If bird and does not fly and long legs and long neck Then ostrich
  { id: "R13", if: ["F2", "G10", "G11", "G16"],  then: "D5", cf: 0.8 },
  // Z14 If bird and does not fly and swims and black and white   Then penguin
  { id: "R14", if: ["F2", "G10", "G20", "G12"],  then: "D6", cf: 0.8 },
];

// ---------- Index bantu ----------
export const RULE_BY_ID = Object.fromEntries(RULES.map((r) => [r.id, r]));

export const RULES_BY_THEN = {};
RULES.forEach((r) => {
  (RULES_BY_THEN[r.then] = RULES_BY_THEN[r.then] || []).push(r);
});

// NODE[id] = { id, type: "G" | "F" | "D", short, name }
export const NODE = {};
Object.entries(SYMPTOMS).forEach(([id, s]) => {
  NODE[id] = { id, type: "G", short: s.short, name: s.question };
});
Object.entries(FACTS).forEach(([id, f]) => {
  NODE[id] = { id, type: "F", short: f.short, name: f.name };
});
Object.entries(DIAGNOSES).forEach(([id, d]) => {
  NODE[id] = { id, type: "D", short: d.short, name: d.name, suspect: !!d.suspect };
});

export const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || id;

export const nodeLabel = (id) => `${id} ${NODE[id].short}`;

// semua rule yang bisa dicapai dari sekumpulan goal (penelusuran ke belakang)
export const rulesFor = (goals) => {
  const seen = new Set();
  const walk = (id) => {
    (RULES_BY_THEN[id] || []).forEach((r) => {
      if (seen.has(r.id)) return;
      seen.add(r.id);
      r.if.forEach(walk);
    });
  };
  goals.forEach(walk);
  return RULES.filter((r) => seen.has(r.id));
};

// jumlah gejala unik yang bisa ditanyakan untuk kategori terpilih
export const symptomsOf = (cats) => {
  const goals = cats.flatMap((c) => CATEGORIES.find((x) => x.id === c).goals);
  return [
    ...new Set(
      rulesFor(goals).flatMap((r) => r.if.filter((p) => NODE[p].type === "G"))
    ),
  ];
};

export const fmtCF = (x) => x.toFixed(2).replace(".", ",");
export const pct = (x) => Math.round(x * 100);

export function verdict(cf) {
  if (cf >= 0.8) return { label: "Sangat mungkin", tone: "high" };
  if (cf >= 0.6) return { label: "Mungkin", tone: "high" };
  if (cf >= 0.4) return { label: "Cukup mungkin", tone: "mid" };
  return { label: "Kecil kemungkinan", tone: "low" };
}
