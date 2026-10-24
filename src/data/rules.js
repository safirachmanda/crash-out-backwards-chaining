// Tingkat keyakinan user -> nilai CF user (5 pilihan)
export const LEVELS = [
  { label: "Tidak", value: 0 },
  { label: "Sedikit Yakin", value: 0.4 },
  { label: "Cukup Yakin", value: 0.6 },
  { label: "Yakin", value: 0.8 },
  { label: "Sangat Yakin", value: 1 },
];

// Basis pengetahuan: tiap hipotesis (goal) punya gejala (premis) dengan CF pakar
export const HYPOTHESES = [
  {
    id: "overheating",
    name: "Overheating",
    desc: "CPU atau GPU panas, kipas berisik, performa lambat",
    symptoms: [
      { id: "temp", cf: 0.8, question: "Apakah suhu CPU atau GPU-mu di atas 70°C saat PC dipakai?" },
      { id: "fan", cf: 0.6, question: "Apakah suara kipas keras, atau kipas berputar kencang terus-menerus?" },
      { id: "slow", cf: 0.6, question: "Apakah PC jadi lambat atau lag setelah menyala beberapa lama?" },
      { id: "shutdown", cf: 0.8, question: "Apakah PC tiba-tiba mati atau restart sendiri tanpa peringatan?" },
      { id: "hot", cf: 0.4, question: "Apakah bodi laptop atau casing PC terasa sangat panas saat disentuh?" },
    ],
    solutions: [
      "Bersihkan debu di kipas, ventilasi, dan heatsink pakai compressed air atau kuas halus.",
      "Pastikan ventilasi tidak tertutup. Pakai cooling pad untuk laptop dan rapikan aliran udara di casing.",
      "Ganti thermal paste CPU/GPU kalau sudah lebih dari 2 sampai 3 tahun.",
      "Tutup aplikasi berat di latar belakang dan ubah power plan ke Balanced.",
      "Pantau suhu dengan HWMonitor atau sejenisnya. Kalau terus di atas 85°C, bawa ke teknisi.",
    ],
  },
  {
    id: "bluescreen",
    name: "Blue Screen",
    desc: "Crash mendadak dan kode error (BSOD)",
    symptoms: [
      { id: "bsod", cf: 0.8, question: "Apakah muncul layar biru dengan pesan error?" },
      { id: "code", cf: 0.6, question: "Apakah ada kode stop di layar itu (misalnya MEMORY_MANAGEMENT)?" },
      { id: "recent", cf: 0.6, question: "Apakah masalah mulai muncul setelah install driver, update Windows, atau hardware baru?" },
      { id: "restart", cf: 0.4, question: "Apakah PC restart sendiri tepat setelah layar biru muncul?" },
      { id: "random", cf: 0.4, question: "Apakah terjadi secara acak, bahkan saat PC tidak dipakai berat?" },
    ],
    solutions: [
      "Catat kode stop-nya lalu cari di internet, biasanya langsung menunjuk penyebabnya.",
      "Rollback atau uninstall driver atau update terakhir yang dipasang sebelum crash mulai terjadi.",
      "Jalankan Windows Memory Diagnostic untuk mengecek RAM.",
      "Jalankan 'sfc /scannow' dan 'chkdsk' di Command Prompt (admin) untuk memperbaiki file sistem dan cek disk.",
      "Cabut perangkat USB yang tidak penting, lalu cek suhu karena overheating juga bisa memicu BSOD.",
    ],
  },
  {
    id: "glitch",
    name: "Graphic Glitch",
    desc: "Artefak, layar berkedip, atau tampilan rusak",
    symptoms: [
      { id: "artifacts", cf: 0.8, question: "Apakah muncul titik, garis, atau kotak warna acak di layar?" },
      { id: "flicker", cf: 0.6, question: "Apakah layar berkedip atau berkelip-kelip?" },
      { id: "games", cf: 0.6, question: "Apakah makin parah saat main game atau memutar video?" },
      { id: "driver", cf: 0.4, question: "Apakah mulai terjadi setelah update driver grafis?" },
      { id: "freeze", cf: 0.6, question: "Apakah layar sempat freeze atau hitam sebentar lalu pulih lagi?" },
    ],
    solutions: [
      "Install ulang driver grafis secara bersih memakai DDU (Display Driver Uninstaller).",
      "Pasang ulang GPU dan pastikan kabel display tertancap kuat, atau coba kabel dan port lain.",
      "Cek suhu GPU. Overheating sering jadi penyebab artefak.",
      "Turunkan overclock GPU dan reset pengaturan BIOS dan driver ke default.",
      "Kalau artefak juga muncul di layar BIOS, kemungkinan GPU-nya rusak dan perlu diperbaiki atau diganti.",
    ],
  },
  {
    id: "corrupted",
    name: "Corrupted Install",
    desc: "File rusak saat install aplikasi",
    symptoms: [
      { id: "error", cf: 0.8, question: "Apakah installer menampilkan pesan file rusak atau tidak bisa dibaca?" },
      { id: "stuck", cf: 0.6, question: "Apakah instalasi selalu gagal di persentase yang sama?" },
      { id: "download", cf: 0.6, question: "Apakah download installer sempat terputus, atau ukuran filenya lebih kecil dari seharusnya?" },
      { id: "storage", cf: 0.4, question: "Apakah drive-mu hampir penuh (sisa ruang kurang dari 10%)?" },
      { id: "antivirus", cf: 0.4, question: "Apakah antivirus memblokir atau menghapus file saat instalasi?" },
    ],
    solutions: [
      "Hapus installer lalu download ulang dari situs resmi, sebaiknya dengan koneksi yang stabil.",
      "Kosongkan ruang disk dan install ke drive yang masih lega.",
      "Matikan antivirus sementara, atau tambahkan pengecualian untuk installer, lalu coba lagi.",
      "Jalankan installer sebagai administrator dan tutup program lain dulu.",
      "Jalankan 'chkdsk' pada drive. File rusak yang berulang bisa jadi tanda disk mulai bermasalah.",
    ],
  },
];

// Hitung CF: CF(gejala) = pakar x user, digabung dengan CFlama + CFbaru x (1 - CFlama)
export function calcCF(hypo, answers) {
  let cf = 0;
  const rows = answers.map((lvl, i) => {
    const s = hypo.symptoms[i];
    const value = s.cf * lvl.value;
    cf = cf + value * (1 - cf);
    return {
      question: s.question,
      expert: s.cf,
      user: lvl.value,
      userLabel: lvl.label,
      value,
    };
  });
  return { cf, rows };
}

export function verdict(cf) {
  if (cf >= 0.8) return { label: "Sangat mungkin", tone: "high" };
  if (cf >= 0.6) return { label: "Mungkin", tone: "high" };
  if (cf >= 0.4) return { label: "Cukup mungkin", tone: "mid" };
  return { label: "Kecil kemungkinan", tone: "low" };
}