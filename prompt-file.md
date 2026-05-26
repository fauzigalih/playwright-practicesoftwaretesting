1. buatkan 1 grup test dengan nama "Feature Search"
2. di dalam grup ada 2 test case
3. task test case pertama:
- test case beri nama "Search Product" tempatkan pada homepage.spec.ts
- kamu harus isi search box dengan keyword "hammer", lalu klik search / enter.
- setelah itu, kamu cari teks "Searched for: <keyword>" dan validasi apakah <keyword> sesuai dengan hasil inputan
- kamu cari teks "<total> products found for '<keyword>'" dan validasi <total> harus sama dengan jumlah product dan <keyword> harus sama dengan yg di input
- berikan list barang sesuai dengan keyword yg di cari
4. task test case kedua:
- test case beri nama "Clear Filter Search" tempatkan pada homepage.spec.ts
- kamu cari dulu dengan keyword "hammer" dan pastikan muncul "Searched for: <keyword>" dan "<total> products found for '<keyword>'"
- pastikan product yg di cari ada
- klik tombol "X" pada search
- validasi tidak ada teks "Searched for: <keyword>" dan "<total> products found for '<keyword>'"
- validasi ada nama product lain selain hammer
5. tempatkan semua variable search box pada fixed.page.ts. cek lagi aku jg sudah buat beberapa variable disana, kalo tidak sesuai ganti aja
6. refactor semua code dan jalankan test 