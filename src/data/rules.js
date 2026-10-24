// Setiap gejala punya 6 pilihan jawaban.
// value = nilai CF user (0 sampai 1), tidak ditampilkan ke user.
// hint  = keterangan kecil supaya orang awam paham maksud pilihannya.

export const HYPOTHESES = [
  {
    id: "overheating",
    name: "Overheating",
    desc: "CPU atau GPU panas, kipas berisik, performa lambat",
    symptoms: [
      {
        id: "temp", cf: 0.8,
        question: "Seberapa tinggi suhu CPU atau GPU saat PC dipakai?",
        options: [
          { label: "Rendah", value: 0, hint: "Dingin atau normal, di bawah ±60°C" },
          { label: "Menengah", value: 0.4, hint: "Hangat, sekitar 60 sampai 70°C" },
          { label: "Cukup tinggi", value: 0.6, hint: "Mulai panas, sekitar 70 sampai 78°C" },
          { label: "Tinggi", value: 0.8, hint: "Panas, sekitar 78 sampai 85°C" },
          { label: "Sangat tinggi", value: 1, hint: "Di atas ±85°C, atau merah di aplikasi monitor" },
          { label: "Tidak tahu", value: 0, hint: "Belum pernah cek suhunya" },
        ],
      },
      {
        id: "fan", cf: 0.6,
        question: "Seberapa keras suara kipas PC-mu?",
        options: [
          { label: "Pelan", value: 0, hint: "Hampir tidak terdengar" },
          { label: "Terdengar halus", value: 0.2, hint: "Baru terdengar kalau ruangan sepi" },
          { label: "Terdengar tapi wajar", value: 0.4, hint: "Ada suara halus saat dipakai" },
          { label: "Cukup keras", value: 0.6, hint: "Terdengar jelas dan mulai terasa mengganggu" },
          { label: "Keras", value: 0.8, hint: "Mengganggu, berputar kencang terus" },
          { label: "Sangat keras", value: 1, hint: "Seperti mau lepas landas" },
        ],
      },
      {
        id: "slow", cf: 0.6,
        question: "Seberapa sering PC jadi lambat atau lag setelah menyala beberapa lama?",
        options: [
          { label: "Tidak pernah", value: 0 },
          { label: "Jarang sekali", value: 0.2 },
          { label: "Kadang-kadang", value: 0.4 },
          { label: "Cukup sering", value: 0.6 },
          { label: "Sering", value: 0.8 },
          { label: "Hampir selalu", value: 1 },
        ],
      },
      {
        id: "shutdown", cf: 0.8,
        question: "Seberapa sering PC mati atau restart sendiri tanpa peringatan?",
        options: [
          { label: "Tidak pernah", value: 0 },
          { label: "Pernah sekali", value: 0.2 },
          { label: "Beberapa kali", value: 0.4 },
          { label: "Cukup sering", value: 0.6 },
          { label: "Sering", value: 0.8 },
          { label: "Hampir setiap dipakai lama", value: 1 },
        ],
      },
      {
        id: "hot", cf: 0.4,
        question: "Seberapa panas bodi laptop atau casing PC saat disentuh?",
        options: [
          { label: "Biasa saja", value: 0 },
          { label: "Sedikit hangat", value: 0.2, hint: "Hampir tidak terasa bedanya" },
          { label: "Hangat", value: 0.4, hint: "Terasa hangat tapi nyaman" },
          { label: "Cukup panas", value: 0.6, hint: "Mulai kurang nyaman disentuh" },
          { label: "Panas", value: 0.8, hint: "Tidak nyaman disentuh lama" },
          { label: "Sangat panas", value: 1, hint: "Tidak tahan menyentuhnya" },
        ],
      },
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
      {
        id: "bsod", cf: 0.8,
        question: "Seberapa sering muncul layar biru dengan pesan error?",
        options: [
          { label: "Tidak pernah", value: 0 },
          { label: "Pernah sekali", value: 0.2 },
          { label: "Dua sampai tiga kali", value: 0.4 },
          { label: "Beberapa kali", value: 0.6 },
          { label: "Sering", value: 0.8 },
          { label: "Sering sekali", value: 1, hint: "Hampir setiap hari atau setiap dipakai" },
        ],
      },
      {
        id: "code", cf: 0.6,
        question: "Apakah ada tulisan kode error di layar biru itu?",
        options: [
          { label: "Tidak ada", value: 0 },
          { label: "Tidak yakin ada atau tidak", value: 0.2 },
          { label: "Tidak sempat lihat", value: 0.4, hint: "Layarnya keburu restart" },
          { label: "Ada, tapi tidak terbaca jelas", value: 0.6 },
          { label: "Ada tulisannya", value: 0.8, hint: "Misalnya huruf kapital seperti MEMORY_MANAGEMENT" },
          { label: "Ada dan sudah kucatat", value: 1 },
        ],
      },
      {
        id: "recent", cf: 0.6,
        question: "Apakah masalah mulai muncul setelah ada yang baru dipasang (driver, update Windows, atau perangkat)?",
        options: [
          { label: "Tidak, dari dulu sudah begitu", value: 0 },
          { label: "Sepertinya tidak berhubungan", value: 0.2 },
          { label: "Tidak yakin", value: 0.4 },
          { label: "Mungkin iya", value: 0.6 },
          { label: "Sepertinya iya", value: 0.8 },
          { label: "Pasti, langsung setelah itu", value: 1 },
        ],
      },
      {
        id: "restart", cf: 0.4,
        question: "Apakah PC restart sendiri setelah layar biru muncul?",
        options: [
          { label: "Tidak, diam di layar biru", value: 0 },
          { label: "Jarang restart", value: 0.2 },
          { label: "Kadang restart", value: 0.4 },
          { label: "Cukup sering restart", value: 0.6 },
          { label: "Hampir selalu restart", value: 0.8 },
          { label: "Selalu restart", value: 1 },
        ],
      },
      {
        id: "random", cf: 0.4,
        question: "Kapan layar biru biasanya muncul?",
        options: [
          { label: "Belum pernah muncul", value: 0 },
          { label: "Hanya saat dipakai sangat berat", value: 0.2, hint: "Game berat, render video, dan sejenisnya" },
          { label: "Saat dipakai berat", value: 0.4, hint: "Game, edit video, dan sejenisnya" },
          { label: "Saat dipakai biasa", value: 0.6, hint: "Browsing, mengetik, dan sejenisnya" },
          { label: "Saat baru menyala", value: 0.8, hint: "Muncul tidak lama setelah masuk Windows" },
          { label: "Acak, bahkan saat didiamkan", value: 1 },
        ],
      },
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
      {
        id: "artifacts", cf: 0.8,
        question: "Seberapa banyak titik, garis, atau kotak warna aneh muncul di layar?",
        options: [
          { label: "Tidak ada", value: 0 },
          { label: "Sangat jarang", value: 0.2 },
          { label: "Sedikit, sesekali", value: 0.4 },
          { label: "Cukup banyak", value: 0.6 },
          { label: "Banyak", value: 0.8 },
          { label: "Memenuhi layar", value: 1 },
        ],
      },
      {
        id: "flicker", cf: 0.6,
        question: "Seberapa sering layar berkedip?",
        options: [
          { label: "Tidak pernah", value: 0 },
          { label: "Jarang", value: 0.2 },
          { label: "Kadang-kadang", value: 0.4 },
          { label: "Cukup sering", value: 0.6 },
          { label: "Sering", value: 0.8 },
          { label: "Terus-menerus", value: 1 },
        ],
      },
      {
        id: "games", cf: 0.6,
        question: "Apakah masalahnya lebih parah saat main game atau memutar video?",
        options: [
          { label: "Tidak ada masalah sama sekali", value: 0 },
          { label: "Sama saja, tidak ada bedanya", value: 0.2 },
          { label: "Sedikit lebih parah", value: 0.4 },
          { label: "Cukup lebih parah", value: 0.6 },
          { label: "Lebih parah", value: 0.8 },
          { label: "Jauh lebih parah", value: 1 },
        ],
      },
      {
        id: "driver", cf: 0.4,
        question: "Apakah masalah mulai muncul setelah update atau install driver grafis?",
        options: [
          { label: "Tidak", value: 0 },
          { label: "Tidak ingat", value: 0.2 },
          { label: "Mungkin", value: 0.4 },
          { label: "Sepertinya iya", value: 0.6 },
          { label: "Hampir pasti iya", value: 0.8 },
          { label: "Pasti iya", value: 1 },
        ],
      },
      {
        id: "freeze", cf: 0.6,
        question: "Seberapa sering layar freeze atau hitam sebentar lalu pulih lagi?",
        options: [
          { label: "Tidak pernah", value: 0 },
          { label: "Pernah sekali", value: 0.2 },
          { label: "Pernah beberapa kali", value: 0.4 },
          { label: "Cukup sering", value: 0.6 },
          { label: "Sering", value: 0.8 },
          { label: "Hampir setiap saat", value: 1 },
        ],
      },
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
      {
        id: "error", cf: 0.8,
        question: "Apakah muncul pesan file rusak atau tidak bisa dibaca saat instalasi?",
        options: [
          { label: "Tidak ada", value: 0 },
          { label: "Ada error, tapi tidak jelas penyebabnya", value: 0.2 },
          { label: "Ada error, tapi tidak menyebut file rusak", value: 0.4 },
          { label: "Menyebut file tidak bisa dibuka atau dibaca", value: 0.6 },
          { label: "Menyebut arsip atau paket rusak", value: 0.8, hint: "Misalnya 'CRC error' atau 'archive is corrupted'" },
          { label: "Ya, jelas menyebut file rusak", value: 1 },
        ],
      },
      {
        id: "stuck", cf: 0.6,
        question: "Apakah instalasi gagal di titik yang sama setiap kali dicoba?",
        options: [
          { label: "Belum pernah gagal", value: 0 },
          { label: "Gagalnya beda-beda", value: 0.2 },
          { label: "Kadang di titik yang sama", value: 0.4 },
          { label: "Sering di titik yang sama", value: 0.6 },
          { label: "Hampir selalu di titik yang sama", value: 0.8 },
          { label: "Selalu di titik yang sama", value: 1 },
        ],
      },
      {
        id: "download", cf: 0.6,
        question: "Apakah proses download installer sempat terputus atau gagal?",
        options: [
          { label: "Tidak, lancar", value: 0 },
          { label: "Tidak yakin", value: 0.2 },
          { label: "Sempat terputus sekali", value: 0.4 },
          { label: "Sempat putus-putus", value: 0.6 },
          { label: "Sering terputus", value: 0.8 },
          { label: "Gagal berkali-kali lalu diulang", value: 1 },
        ],
      },
      {
        id: "storage", cf: 0.4,
        question: "Seberapa penuh penyimpanan (drive) tempat kamu menginstal?",
        options: [
          { label: "Masih lega", value: 0, hint: "Terpakai kurang dari setengah" },
          { label: "Sudah setengah terpakai", value: 0.2 },
          { label: "Terpakai sekitar 70%", value: 0.4 },
          { label: "Terpakai lebih dari 85%", value: 0.6 },
          { label: "Hampir penuh", value: 0.8 },
          { label: "Penuh sekali", value: 1, hint: "Sisa ruang hanya beberapa GB atau kurang" },
        ],
      },
      {
        id: "antivirus", cf: 0.4,
        question: "Apakah antivirus memblokir atau menghapus file saat instalasi?",
        options: [
          { label: "Tidak", value: 0 },
          { label: "Tidak tahu", value: 0.2 },
          { label: "Pernah sekali ada notifikasi", value: 0.4 },
          { label: "Ada notifikasi sesekali", value: 0.6 },
          { label: "Cukup sering memblokir", value: 0.8 },
          { label: "Selalu memblokir atau menghapus file", value: 1 },
        ],
      },
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
// answers = daftar opsi yang dipilih user ({ label, value })
export function calcCF(hypo, answers) {
  let cf = 0;
  const rows = answers.map((opt, i) => {
    const s = hypo.symptoms[i];
    const value = s.cf * opt.value;
    cf = cf + value * (1 - cf);
    return {
      question: s.question,
      expert: s.cf,
      user: opt.value,
      userLabel: opt.label,
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