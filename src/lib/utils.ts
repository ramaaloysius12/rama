// 1. Fungsi untuk format tanggal bahasa Indonesia
export function formatDate(dateInput: Date | string) {
  const date = new Date(dateInput);
  
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

// 2. Fungsi untuk membuat URL otomatis dari Judul Berita (Slugify)
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Ganti spasi dengan tanda hubung (-)
    .replace(/[^\w\-]+/g, '')   // Hapus karakter khusus selain huruf, angka, dan -
    .replace(/\-\-+/g, '-');    // Ganti tanda hubung ganda menjadi tunggal
}

// CATATAN: Jika di file Anda sebelumnya ada fungsi 'cn' (tailwind-merge), 
// Anda bisa membiarkannya tetap ada di bagian atas file.
