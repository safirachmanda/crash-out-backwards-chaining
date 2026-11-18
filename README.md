# Crash-Out

Sistem pakar diagnosis masalah PC. Metode: **backward chaining** + **Certainty Factor (CF)**.
Basis pengetahuan mengikuti pola rule Zookeeper (Z1-Z14) yang disesuaikan ke diagnosis PC.

## Menjalankan

```bash
npm install
npm start
```

## Struktur penting

| File | Isi |
|---|---|
| `src/data/rules.js` | Basis pengetahuan: 20 gejala (G), 4 fakta antara (F), 6 diagnosis (D), 14 rule (R1-R14) dengan pola persis rule Zookeeper (Z1-Z14), pilihan jawaban berupa kata, rekomendasi perbaikan |
| `src/data/engine.js` | Mesin inferensi backward chaining, working memory, perhitungan CF |
| `src/components/Diagnose.js` | Alur diagnosa: form spek, chat Ya/Tidak lalu pilihan kata, hasil, jejak rule (dilipat) |

## Cara kerja

1. User memilih satu atau beberapa dari 6 kartu masalah (Overheating, Thermal Paste, Blue Screen, Graphic Glitch, Kerusakan GPU/VRAM, Corrupted Install). Tiap kartu menuju satu diagnosis.
2. Rule berantai seperti Zookeeper: gejala -> fakta antara -> diagnosis. Satu fakta bisa dibentuk beberapa rule (OR) dan dipakai banyak rule sesudahnya (F1 Suhu berlebih dipakai R5-R8).
3. Tiap gejala ditanya Ya/Tidak. Kalau Ya, user memilih pilihan kata khusus gejala itu (misalnya "Sesekali tidak berputar", "Hampir selalu tidak berputar"). Pilihan itu diubah ke CF di belakang layar, tanpa menampilkan skala angka.
4. Gejala bersama (G1 di Overheating dan Graphic Glitch, G4 di Overheating dan Blue Screen) hanya ditanya sekali.
5. Rule yang satu premisnya gagal langsung gugur, premis sisanya tidak ditanya.
6. Hasil bisa berisi banyak diagnosis, lengkap dengan persentase dan rekomendasi. Jejak rule ada di bagian yang bisa dilipat.

## Rumus CF

- Beberapa premis (AND) -> diambil yang terkecil: CF rule = CF pakar x min(CF seluruh premis)
- Beberapa rule ke kesimpulan yang sama (OR) -> CF combine: CF gabungan = CF lama + CF baru x (1 - CF lama)

Contoh: R1 (G1) = 0,8 x 0,8 = 0,64 dan R2 (G5) = 0,7 x 0,6 = 0,42, maka F1 = 0,64 + 0,42 x (1 - 0,64) = 0,79.

Nilai CF pakar di `rules.js` adalah nilai usulan dan perlu divalidasi pakar atau dosen. Semua diagnosis ditampilkan sebagai hasil pasti, lengkap dengan persentase CF.

## Pemetaan ke Zookeeper

| Zookeeper | Crash-Out |
|---|---|
| Z1-Z2 Mammal | R1-R2 F1 Suhu berlebih |
| Z3-Z4 Bird | R3-R4 F2 Sistem atau file bermasalah |
| Z5-Z6 Carnivore | R5-R6 F3 Pendinginan tidak efektif |
| Z7-Z8 Ungulate | R7-R8 F4 Gangguan tampilan saat suhu tinggi |
| Z9 Cheetah, Z10 Tiger | R9 D1 Overheating, R10 D2 Thermal Paste |
| Z11 Giraffe, Z12 Zebra | R11 D3 Graphic Glitch, R12 D4 Kerusakan GPU/VRAM |
| Z13 Ostrich, Z14 Penguin | R13 D5 Blue Screen, R14 D6 Corrupted Install |

Rule R1-R14 persis mengikuti Z1-Z14 di slide: jumlah premis, rantai fakta, dan gejala yang dipakai bersama (tawny color G4, dark spots G6, black stripes G8, long legs G11, long neck G16, does not fly G10). Tidak ada rule tambahan.
