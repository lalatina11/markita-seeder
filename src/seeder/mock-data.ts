import { faker, fakerID_ID } from "@faker-js/faker";
import type { RegisterSchemaType } from "../lib/validation/user";
import type { CreateStoreSchemaType } from "../lib/validation/store";
import type { CreateProductSchemaType } from "../lib/validation/product";

// Predefined realistic product catalog with authentic Indonesian marketplace context
export interface ProductTemplate {
  name: string;
  category: string;
  description: string;
  price: number;
  media: Array<{
    media_type: "image" | "video";
    media_url: string;
  }>;
}

export const PRODUCT_TEMPLATES: ProductTemplate[] = [
  // --- Elektronik & Gadget ---
  {
    name: "Smartwatch AMOLED Display Waterproof IP68",
    category: "Elektronik",
    description:
      "Smartwatch modern dengan layar AMOLED 1.43 inch yang tajam dan hemat daya. Dilengkapi fitur pelacak detak jantung 24 jam, SpO2, sleep monitor, dan 100+ mode olahraga. Tahan air hingga kedalaman 50 meter.",
    price: 599000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      },
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "TWS Earphone Wireless Bluetooth 5.3 Active Noise Cancelling",
    category: "Elektronik",
    description:
      "Earphone nirkabel True Wireless Stereo (TWS) dengan fitur ANC pintar. Menghasilkan suara bass mendalam dan vokal jernih. Daya tahan baterai hingga 30 jam dengan casing pengisi daya.",
    price: 349000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Keyboard Mechanical RGB Backlit Blue Switch TKL",
    category: "Elektronik",
    description:
      "Keyboard gaming mekanikal Tenkeyless (87 tombol) dengan clicky blue switch yang responsif dan tahan hingga 50 juta kali ketukan. Dilengkapi 18 mode pencahayaan RGB dinamis.",
    price: 479000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Mouse Wireless Ergonomic Silent Click 2.4GHz",
    category: "Elektronik",
    description:
      "Mouse nirkabel desain ergonomis yang nyaman digenggam sepanjang hari. Tombol silent click tidak berisik, resolusi DPI dapat diatur (800/1200/1600). Hemat daya dengan fitur auto sleep.",
    price: 139000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Powerbank Fast Charging 20000mAh Power Delivery 22.5W",
    category: "Elektronik",
    description:
      "Powerbank berkapasitas besar 20.000mAh dengan port ganda Type-C dan USB-A. Mendukung protokol Fast Charging PD 3.0 dan QC 4.0. Dilengkapi LED display indikator persentase baterai.",
    price: 259000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Speaker Bluetooth Portable Waterproof Outdoor Bass",
    category: "Elektronik",
    description:
      "Speaker nirkabel portabel dengan sertifikasi anti air IPX7. Suara stereo 360 derajat dengan dual passive radiator untuk bass menggelegar. Baterai tahan hingga 12 jam pemutaran musik nonstop.",
    price: 389000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },

  // --- Fashion & Busana ---
  {
    name: "Kemeja Batik Pria Lengan Panjang Katun Primisima Premium",
    category: "Fashion",
    description:
      "Kemeja batik pria modern bahan katun primisima halus dan adem dipakai. Jahitan rapi dengan furing hero nyaman. Motif batik kontemporer cocok untuk acara formal, kantor, dan kondangan.",
    price: 195000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
      },
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Kaos Polos Heavyweight Cotton Combed 24s Oversized",
    category: "Fashion",
    description:
      "T-shirt oversized unisex dengan potongan streetwear terkini. Dibuat dari 100% cotton combed 24s tebal, lembut, dan menyerap keringat maksimal. Kerah tebal anti melar.",
    price: 79000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Jaket Denim Pria Vintage Washed Classic Blue",
    category: "Fashion",
    description:
      "Jaket jeans denim original 14oz non-stretch dengan efek cucian vintage wash premium. Potongan regular fit yang maskulin dengan kancing logam kokoh berlogo timbul.",
    price: 285000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Sepatu Sneakers Pria Casual Low Top Kanvas Retro",
    category: "Fashion",
    description:
      "Sneakers kasual pria siluet klasik timeless. Upper kanvas premium breathable dipadukan dengan outsole karet vulkanisir anti selip. Insole empuk foam memory menjamin kenyamanan seharian.",
    price: 299000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
      },
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Tas Ransel Laptop Backpack Minimalis Water Resistant 15.6 Inch",
    category: "Fashion",
    description:
      "Ransel kerja dan kuliah berkapasitas 22 liter dengan kompartemen laptop berbusa tebal aman benturan. Bahan cordura nylon tahan air hujan intensitas sedang, ada port kabel USB.",
    price: 229000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Dompet Kulit Sapi Asli Bifold Pria Anti RFID Minimalis",
    category: "Fashion",
    description:
      "Dompet pria berbahan 100% kulit sapi asli jenis crazy horse leather dengan tekstur klasik. Dilengkapi lapisan pelindung sinyal RFID untuk keamanan kartu kredit/debit dari skimming.",
    price: 135000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },

  // --- Makanan & Minuman ---
  {
    name: "Biji Kopi Arabika Gayo Aceh Specialty Single Origin 250g",
    category: "Makanan & Minuman",
    description:
      "Kopi arabika asli dataran tinggi Gayo Aceh, diproses secara semi-washed. Profil sangrai medium roast dengan cupping notes karamel manis, acidity lembut fruity, dan aroma wangi rempah.",
    price: 85000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Madu Hutan Liar Murni Alami 100% Organik 500ml",
    category: "Makanan & Minuman",
    description:
      "Madu mentah (raw honey) langsung dari sarang lebah pohon sialang hutan Sumatra. Tanpa proses pemanasan atau penambahan gula, kaya enzim alami dan antioksidan untuk imunitas tubuh.",
    price: 125000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Keripik Singkong Balado Pedas Manis Renyah Gurih 250g",
    category: "Makanan & Minuman",
    description:
      "Camilan keripik singkong renyah dengan bumbu balado racikan rempah khas Minang. Rasa pedas, manis, dan gurih yang seimbang tanpa pengawet buatan.",
    price: 25000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Sambal Cumi Asin Cabe Ijo Toples Segar Khas Rumahan 180g",
    category: "Makanan & Minuman",
    description:
      "Sambal cabe ijo dengan potongan cumi asin empuk melimpah. Dimasak tradisional dengan minyak kelapa pilihan, pedas nendang cocok dinikmati bersama nasi hangat.",
    price: 42000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },

  // --- Rumah Tangga & Dekorasi ---
  {
    name: "Diffuser Aromaterapi Ultrasonic Wood Grain 500ml + Remote Control",
    category: "Rumah Tangga",
    description:
      "Humidifier dan diffuser aromaterapi dengan motif serat kayu estetik. Kapasitas tangki besar 500ml mampu beroperasi hingga 10 jam. Dilengkapi lampu tidur LED 7 warna dan timer otomatis.",
    price: 165000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Lampu Meja Kerja Belajar LED Eye Protection Touch Dimmer",
    category: "Rumah Tangga",
    description:
      "Lampu baca modern dengan teknologi anti silau (eye-protection). Tingkat kecerahan dan temperatur warna dapat disesuaikan (Warm, Cool, Natural). Tiang fleksibel dapat ditekuk 360 derajat.",
    price: 119000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Cangkir Keramik Handmade Mug Kopi Artisan Nordic 350ml",
    category: "Rumah Tangga",
    description:
      "Gelas mug kopi keramik buatan tangan pengrajin lokal. Finishing matte glaze bertekstur alami yang cantik dan nyaman digenggam. Tahan microwave dan mesin pencuci piring.",
    price: 58000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Rak Bumbu Dapur Minimalis Kayu Jati Belanda Susun 2",
    category: "Rumah Tangga",
    description:
      "Rak penyimpanan bumbu dan toples dapur terbuat dari kayu pinus jati belanda solid. Diampelas halus dengan pernis clear doff ramah lingkungan. Membuat dapur terlihat rapi dan estetik.",
    price: 89000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },

  // --- Kecantikan & Perawatan Diri ---
  {
    name: "Brightening Face Serum Vitamin C & Niacinamide 10% 30ml",
    category: "Kecantikan",
    description:
      "Serum pencerah wajah dengan kombinasi Ethyl Ascorbic Acid dan Niacinamide 10%. Membantu memudarkan noda hitam bekas jerawat, meratakan warna kulit, serta menyamarkan pori-pori.",
    price: 94000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Sunscreen Gel SPF 50+ PA++++ Ringan No Whitecast 50ml",
    category: "Kecantikan",
    description:
      "Tabir surya harian tekstur water-gel ringan mudah meresap tanpa rasa lengket atau kilap minyak berlebih. Mengandung Centella Asiatica yang menenangkan kulit terpapar sinar matahari.",
    price: 78000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Gentle Facial Wash Cleanser Low pH Centella 100ml",
    category: "Kecantikan",
    description:
      "Sabun pembersih muka dengan busa lembut dan formula pH seimbang (5.5). Membersihkan kotoran hingga pori-pori tanpa merusak skin barrier alami kulit wajah.",
    price: 59000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1556228722-d0b5d9d7990c?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },

  // --- Olahraga & Aktivitas Luar Ruang ---
  {
    name: "Matras Yoga NBR 10mm Tebal Anti Slip Free Tali Strap Tas",
    category: "Olahraga",
    description:
      "Matras senam yoga, pilates, dan workout di rumah dengan ketebalan ekstra 10mm empuk untuk melindungi sendi dan lutut. Bahan NBR ramah lingkungan dengan tekstur timbul anti selip.",
    price: 129000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Botol Minum Tumbler Vacuum Insulated Stainless Steel 750ml",
    category: "Olahraga",
    description:
      "Termos botol minum stainless steel food grade 304 dengan teknologi insulasi dinding ganda. Menjaga minuman tetap dingin hingga 24 jam dan panas hingga 12 jam. Tutup botol kedap anti tumpah.",
    price: 115000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    name: "Resistance Band Set 5 Level Tube Latihan Gym & Fitness Rumah",
    category: "Olahraga",
    description:
      "Paket lengkap tali karet resistensi 5 level beban (10 lbs hingga 50 lbs). Dilengkapi pegangan busa empuk, strap engkel, dan jangkar pintu untuk variasi latihan otot tubuh di rumah.",
    price: 74000,
    media: [
      {
        media_type: "image",
        media_url:
          "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
];

// Curated Indonesian Store Themes
export const STORE_PRESETS = [
  {
    name: "Sentral Gadget Indonesia",
    avatar:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80",
    banner:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    city: "Jakarta Selatan",
    address: "Jl. TB Simatupang No. 18, Cilandak",
  },
  {
    name: "Batik Pesona Nusantara",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
    banner:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    city: "Yogyakarta",
    address: "Jl. Malioboro No. 42, Danurejan",
  },
  {
    name: "Kedai Kopi & Rempah Berkah",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    banner:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80",
    city: "Bandung",
    address: "Jl. Ir. H. Juanda (Dago) No. 108",
  },
  {
    name: "Studio Dekorasi Rumah Kita",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80",
    banner:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80",
    city: "Surabaya",
    address: "Jl. Darmo Permai Timur No. 77",
  },
  {
    name: "Aura Glow Beauty Store",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
    banner:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80",
    city: "Jakarta Pusat",
    address: "Jl. MH Thamrin No. 25, Menteng",
  },
  {
    name: "Prima Sport & Outdoor Gear",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    banner:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80",
    city: "Semarang",
    address: "Jl. Pandanaran No. 54",
  },
];

const INDONESIAN_CITIES = [
  "Jakarta Selatan",
  "Jakarta Pusat",
  "Jakarta Barat",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Denpasar",
  "Malang",
  "Tangerang",
  "Bekasi",
  "Bogor",
  "Surakarta",
  "Makassar",
];

const STORE_PREFIXES = [
  "Toko",
  "Warung",
  "Kedai",
  "Studio",
  "Galeri",
  "Sentra",
  "Official Store",
  "Gudang",
  "Mitra",
  "Boutique",
];

const STORE_SUFFIXES = [
  "Berkah Jaya",
  "Makmur Abadi",
  "Kreatif Nusantara",
  "Sejahtera Bersama",
  "Sentosa Utama",
  "Maju Sukses",
  "Prima Mandiri",
  "Sinar Terang",
  "Indah Lestari",
  "Bintang Mulia",
  "Harapan Bangsa",
];

/**
 * Generate unique, valid user registration payload
 */
export function generateUserData(
  custom?: Partial<RegisterSchemaType>,
): RegisterSchemaType {
  const firstName = fakerID_ID.person.firstName();
  const lastName = fakerID_ID.person.lastName();
  const displayName = `${firstName} ${lastName}`.trim();
  const uniqueSuffix = `${Date.now()}_${faker.number.int({ min: 100, max: 999 })}`;
  const cleanUser = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(
    /[^a-z0-9]/g,
    "",
  );
  const email = `${cleanUser || "user"}.${uniqueSuffix}@markita.test`;
  const password = "password123";

  return {
    email: custom?.email ?? email,
    password: custom?.password ?? password,
    data: {
      display_name: custom?.data?.display_name ?? (displayName.length >= 3 ? displayName : "User Pengguna"),
    },
  };
}

/**
 * Generate realistic Indonesian store data
 */
export function generateStoreData(
  index?: number,
  custom?: Partial<CreateStoreSchemaType>,
): CreateStoreSchemaType {
  // Use presets if index is within range, otherwise generate procedurally
  if (index !== undefined && STORE_PRESETS[index]) {
    const preset = STORE_PRESETS[index]!;
    return {
      name: custom?.name ?? preset.name,
      avatar: custom?.avatar ?? preset.avatar,
      banner: custom?.banner ?? preset.banner,
      address: custom?.address ?? preset.address,
      city: custom?.city ?? preset.city,
    };
  }

  const prefix = faker.helpers.arrayElement(STORE_PREFIXES);
  const suffix = faker.helpers.arrayElement(STORE_SUFFIXES);
  const storeName = `${prefix} ${suffix} ${faker.number.int({ min: 1, max: 99 })}`;
  const city = faker.helpers.arrayElement(INDONESIAN_CITIES);
  const street = fakerID_ID.location.streetAddress();

  const avatar = `https://images.unsplash.com/photo-${faker.helpers.arrayElement([
    "1534528741775-53994a69daeb",
    "1507003211169-0a1dd7228f2d",
    "1517841905240-472988babdf9",
    "1544005313-94ddf0286df2",
    "1500648767791-00dcc994a43e",
    "1523275335684-37898b6baf30",
  ])}?w=300&auto=format&fit=crop&q=80`;

  const banner = `https://images.unsplash.com/photo-${faker.helpers.arrayElement([
    "1441986300917-64674bd600d8",
    "1472851294608-062f824d29cc",
    "1555421689-491a97ff2040",
    "1528698827591-e19ccd7bc23d",
    "1513694203232-719a280e022f",
  ])}?w=1200&auto=format&fit=crop&q=80`;

  return {
    name: custom?.name ?? (storeName.length >= 5 ? storeName : `Toko Markita ${Date.now()}`),
    avatar: custom?.avatar ?? avatar,
    banner: custom?.banner ?? banner,
    address: custom?.address ?? `Jl. ${street} No. ${faker.number.int({ min: 1, max: 150 })}`,
    city: custom?.city ?? city,
  };
}

/**
 * Generate realistic product data for a store
 */
export function generateProductData(
  storeId: string,
  index?: number,
  custom?: Partial<CreateProductSchemaType>,
): CreateProductSchemaType {
  if (index !== undefined && PRODUCT_TEMPLATES[index % PRODUCT_TEMPLATES.length]) {
    const template = PRODUCT_TEMPLATES[index % PRODUCT_TEMPLATES.length]!;
    return {
      store_id: storeId,
      name: custom?.name ?? template.name,
      description: custom?.description ?? template.description,
      price: custom?.price ?? template.price,
      media: custom?.media ?? template.media,
    };
  }

  // Procedural generation if no template or random pick
  const randomTemplate = faker.helpers.arrayElement(PRODUCT_TEMPLATES);
  const variant = faker.helpers.arrayElement([
    "Edisi Spesial",
    "Model Terbaru",
    "Original Garansi Resmi",
    "Premium Quality",
  ]);

  return {
    store_id: storeId,
    name: custom?.name ?? `${randomTemplate.name} (${variant})`,
    description: custom?.description ?? randomTemplate.description,
    price: custom?.price ?? randomTemplate.price,
    media: custom?.media ?? randomTemplate.media,
  };
}
