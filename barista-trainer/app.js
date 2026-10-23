/**
 * ============================================================
 *  BARISTA RECIPE TRAINER – app.js
 *  Toàn bộ logic ứng dụng: LocalStorage DB, CRUD, Smart Import,
 *  Game Select & Mix, Game Recall & Type, Hint System, Scoring.
 *  Viết bằng JavaScript ES6+ thuần (Vanilla JS).
 *  Chú thích bằng tiếng Việt theo từng hàm chính.
 * ============================================================
 */

'use strict';

/* =============================================================
   PHẦN 1: CẤU HÌNH & DỮ LIỆU MẪU BAN ĐẦU
   ============================================================= */

/** Key lưu trữ trong localStorage */
/** Key lưu trữ trong localStorage */
const LS_KEY_RECIPES = 'barista_recipes';
const LS_KEY_SCORE = 'barista_score';
const LS_KEY_STREAK = 'barista_streak';
const LS_KEY_HISTORY = 'barista_import_history';
const LS_KEY_VERSION = 'barista_recipes_ver';
const LS_KEY_BREWING_RECIPES = 'barista_brewing_recipes';
const CURRENT_DATA_VERSION = 3;

/**
 * Dữ liệu mẫu khởi tạo – bao gồm 17 công thức đầy đủ và chuẩn xác.
 * Chia thành 2 nhóm chính: ☕ CÀ PHÊ và 🍵 TRÀ (kèm Mocktail & Smoothie bổ sung).
 * Mỗi công thức: id, name, category, icon, tags[], ingredients[], steps[]
 * ingredients[]: { name: string, amount: string }
 */
const SAMPLE_RECIPES = [

  /* =========================================
     ☕ NHÓM 1: CÀ PHÊ (COFFEE BAR)
     ========================================= */

  {
    id: 'r_man_cf_muoi',
    name: 'Mặn (Cà Phê Muối)',
    category: 'Coffee',
    icon: '🧂',
    tags: ['Đá', 'Nóng', 'Giảm Ngọt'],
    ingredients: [
      { name: 'Cốt muối', amount: '60ml (đá) / 40ml (giảm ngọt)' },
      { name: 'Cà phê phin', amount: '40ml' },
      { name: 'Bột ke', amount: '2g (1 thìa đầy có chóp)' },
      { name: 'Muối hồng', amount: '3 thìa mini' },
      { name: 'Đá viên to', amount: '2 viên' },
      { name: 'Sữa tươi (uống nóng)', amount: '30ml' },
      { name: 'Rich lùn (giảm ngọt)', amount: '20ml' }
    ],
    steps: [
      '🧊 ĐÁ: Cho 60ml cốt muối + 40ml phin vào ly.',
      'Thêm 1 thìa đầy có chóp bột ke (2g) + 3 thìa muối hồng (thìa mini).',
      'Cho 2 viên đá to, khuấy đều và phục vụ.',
      '🔥 NÓNG: Thêm 30ml sữa tươi nóng → Thực hiện theo công thức như trên.',
      '📉 GIẢM NGỌT: 40ml cốt muối + 20ml Rich + 40ml phin.',
      '👉 SIZE L GIẢM NGỌT: 60ml phin + 60ml cốt muối + 30ml Rich.'
    ]
  },

  {
    id: 'r_be_cf',
    name: 'BE (Cà Phê Kem Muối BE)',
    category: 'Coffee',
    icon: '☁️',
    tags: ['Đá', 'Nóng', 'Giảm Ngọt'],
    ingredients: [
      { name: 'Whipping cream', amount: '40ml' },
      { name: 'Cà phê phin', amount: '40ml' },
      { name: 'Sữa đặc', amount: '15ml (chuẩn) / 10ml (50%) / 5ml (0%)' },
      { name: 'Muối hồng', amount: '1 thìa mini' },
      { name: 'Đá viên to', amount: '2 viên' },
      { name: 'Sữa tươi (uống nóng)', amount: '50ml' }
    ],
    steps: [
      '🧊 ĐÁ: Cho 40ml whipping cream + 40ml cà phê phin vào ly.',
      'Thêm 15ml sữa đặc + 1 thìa muối hồng (thìa mini) + 2 viên đá to.',
      'Khuấy đều và phục vụ.',
      '🔥 NÓNG: Thêm 50ml sữa tươi nóng → Thực hiện theo công thức như trên.',
      '📉 GIẢM NGỌT 50%: Dùng 10ml sữa đặc.',
      '📉 GIẢM NGỌT 0%: Dùng 5ml sữa đặc.'
    ]
  },

  {
    id: 'r_coldbrew_dao_mo',
    name: 'Coldbrew Đào Mơ',
    category: 'Coffee',
    icon: '🍑',
    tags: ['Ly & Chai 250ml'],
    ingredients: [
      { name: 'Coldbrew', amount: '150ml (ly) / 250ml (chai)' },
      { name: 'Mứt đào', amount: '20ml (ly) / 35ml (chai)' },
      { name: 'Đường cà phê', amount: '5ml (ly) / 9ml (chai)' },
      { name: 'Đá viên to', amount: '1 viên' },
      { name: 'Đào miếng ngâm (décor)', amount: '3 lát' },
      { name: 'Hoa violet (décor)', amount: '1 bông' }
    ],
    steps: [
      '🧊 PHA LY: Cho 1 viên đá to vào ly.',
      'Rót 150ml coldbrew + 20ml mứt đào + 5ml đường cà phê.',
      'Khuấy nhẹ cho hòa quyện.',
      '🌸 DÉCOR: 3 lát đào xếp xòe cánh cạnh miệng ly + 1 bông hoa violet.',
      '📉 GIẢM NGỌT 50%: 2,5ml đường cà phê.',
      '📉 GIẢM NGỌT 0%: 0ml đường cà phê.',
      '🍶 CHAI 250ml: 250ml coldbrew + 35ml mứt đào + 9ml đường cà phê. Dán tem, cho vào túi giấy.'
    ]
  },

  {
    id: 'r_coldbrew_sau_dien',
    name: 'Coldbrew Sấu Điện',
    category: 'Coffee',
    icon: '🍏',
    tags: ['Ly & Chai 250ml', 'Đặc Sản Hà Nội'],
    ingredients: [
      { name: 'Coldbrew', amount: '150ml (ly) / 250ml (chai)' },
      { name: 'Nước sấu ngâm', amount: '20ml (ly) / 40ml (chai)' },
      { name: 'Quả sấu ngâm', amount: '3 quả (ly) / 6 quả (chai)' },
      { name: 'Đá viên to', amount: '1 viên' },
      { name: 'Nhánh gừng (décor)', amount: '1 nhánh (nếu có)' },
      { name: 'Hoa violet (décor)', amount: '1 bông' }
    ],
    steps: [
      '🧊 PHA LY: Cho 1 viên đá to vào ly.',
      'Rót 150ml coldbrew + 20ml nước sấu ngâm + thả 3 quả sấu.',
      '🌸 DÉCOR: 1 nhánh gừng (nếu có) + 1 bông hoa violet.',
      '📉 GIẢM NGỌT 50%: 15ml nước sấu ngâm.',
      '📉 GIẢM NGỌT 0%: Chỉ lấy 3 quả sấu, không lấy nước sấu.',
      '🍶 CHAI 250ml: 250ml coldbrew + 40ml nước sấu ngâm. 6 quả sấu cho ra cốc giấy riêng đựng topping. Dán tem, cho vào túi giấy.'
    ]
  },

  {
    id: 'r_coldbrew_buoi_luu',
    name: 'Coldbrew Bưởi Lựu',
    category: 'Coffee',
    icon: '🍊',
    tags: ['Ly & Chai 250ml'],
    ingredients: [
      { name: 'Coldbrew', amount: '150ml (ly) / 250ml (chai)' },
      { name: 'Mứt bưởi', amount: '5ml (ly) / 10ml (chai)' },
      { name: 'Mứt lựu', amount: '15ml (ly) / 25ml (chai)' },
      { name: 'Đường cà phê', amount: '5ml (ly) / 9ml (chai)' },
      { name: 'Đá viên to', amount: '1 viên' },
      { name: 'Cam vàng sấy (décor)', amount: '½ lát' },
      { name: 'Hoa tươi (décor)', amount: '1 bông' }
    ],
    steps: [
      '🧊 PHA LY: Cho 1 viên đá to vào ly.',
      'Rót 150ml coldbrew + 5ml mứt bưởi + 15ml mứt lựu + 5ml đường cà phê.',
      'Khuấy nhẹ cho hòa quyện.',
      '🌸 DÉCOR: ½ lát cam vàng sấy + 1 bông hoa tươi.',
      '📉 GIẢM NGỌT 50%: 2,5ml đường cà phê.',
      '📉 GIẢM NGỌT 0%: 0ml đường cà phê.',
      '🍶 CHAI 250ml: 250ml coldbrew + 10ml mứt bưởi + 25ml mứt lựu + 9ml đường cà phê. Dán tem, cho vào túi giấy.'
    ]
  },

  {
    id: 'r_coldbrew_buoi_leo',
    name: 'Coldbrew Bưởi Leo',
    category: 'Coffee',
    icon: '🍋',
    tags: ['Ly & Chai 250ml'],
    ingredients: [
      { name: 'Coldbrew', amount: '150ml (ly) / 250ml (chai)' },
      { name: 'Mứt bưởi', amount: '5ml (ly) / 10ml (chai)' },
      { name: 'Mứt chanh leo', amount: '15ml (ly) / 25ml (chai)' },
      { name: 'Đường cà phê', amount: '5ml (ly) / 9ml (chai)' },
      { name: 'Đá viên to', amount: '1 viên' },
      { name: 'Cam vàng sấy (décor)', amount: '½ lát' },
      { name: 'Hoa tươi (décor)', amount: '1 bông' }
    ],
    steps: [
      '🧊 PHA LY: Cho 1 viên đá to vào ly.',
      'Rót 150ml coldbrew + 5ml mứt bưởi + 15ml mứt chanh leo + 5ml đường cà phê.',
      'Khuấy nhẹ cho hòa quyện.',
      '🌸 DÉCOR: ½ lát cam vàng sấy + 1 bông hoa tươi.',
      '📉 GIẢM NGỌT 50%: 2,5ml đường cà phê.',
      '📉 GIẢM NGỌT 0%: 0ml đường cà phê.',
      '🍶 CHAI 250ml: 250ml coldbrew + 10ml mứt bưởi + 25ml mứt chanh leo + 9ml đường cà phê. Dán tem, cho vào túi giấy.'
    ]
  },

  {
    id: 'r001',
    name: 'Espresso',
    category: 'Coffee',
    icon: '☕',
    tags: ['Cổ Điển'],
    ingredients: [
      { name: 'Cà phê rang xay', amount: '18g' },
      { name: 'Nước lọc nóng 90-94°C', amount: '30ml' }
    ],
    steps: [
      'Rang và xay cà phê mịn vừa phải.',
      'Nén cà phê vào portafilter với lực 15-20kg.',
      'Pha shot 25-30 giây với nước 90-94°C.',
      'Thu được 30ml espresso màu nâu sánh.'
    ]
  },

  {
    id: 'r002',
    name: 'Cappuccino',
    category: 'Coffee',
    icon: '☕',
    tags: ['Cổ Điển'],
    ingredients: [
      { name: 'Espresso shot', amount: '30ml' },
      { name: 'Sữa tươi nguyên kem', amount: '60ml' },
      { name: 'Bọt sữa mịn', amount: '60ml' },
      { name: 'Bột cacao', amount: 'Rắc nhẹ' }
    ],
    steps: [
      'Pha 1 shot espresso vào tách.',
      'Hâm nóng sữa đến 65°C và đánh bọt mịn.',
      'Đổ sữa nóng vào tách theo tỉ lệ 1:1:1.',
      'Rắc bột cacao lên mặt để trang trí.'
    ]
  },

  {
    id: 'r003',
    name: 'Caffe Latte',
    category: 'Coffee',
    icon: '☕',
    tags: ['Cổ Điển'],
    ingredients: [
      { name: 'Espresso shot', amount: '60ml' },
      { name: 'Sữa tươi nguyên kem', amount: '180ml' },
      { name: 'Bọt sữa', amount: '1cm' }
    ],
    steps: [
      'Pha 2 shots espresso vào ly lớn.',
      'Hâm nóng và đánh bọt sữa ở 65°C.',
      'Đổ từ từ sữa nóng vào espresso.',
      'Tạo lớp bọt sữa mỏng 1cm trên mặt.'
    ]
  },

  /* =========================================
     🍵 NHÓM 2: TRÀ (TEA & MATCHA BAR)
     ========================================= */

  {
    id: 'r_matcha_snap',
    name: 'Matcha SNAP! (Ép Táo)',
    category: 'Tea',
    icon: '🍵',
    tags: ['Matcha Specialty', 'Phân Tầng'],
    ingredients: [
      { name: 'Bột matcha', amount: '3g' },
      { name: 'Nước sôi mix nước nguội', amount: '40ml sôi + 40ml nguội (tổng 80ml)' },
      { name: 'Nước ép táo', amount: '130ml' },
      { name: 'Đường cà phê', amount: '15ml (chuẩn) / 5ml (50%) / 0ml (0%)' },
      { name: 'Đá viên to', amount: '2-3 viên' },
      { name: 'Hoa violet (décor)', amount: '1 bông' }
    ],
    steps: [
      '🍵 PHẦN MATCHA: Rây 3g bột matcha vào bát chawan.',
      'Pha cùng 40ml nước sôi + 40ml nước nguội (tổng 80ml).',
      'Dùng chổi chuyên dụng chasen đánh mịn 3-5 phút đến khi sủi bọt tuyết mịn.',
      '🍏 PHẦN TRÌNH BÀY: Đổ 130ml nước ép táo vào ly + 15ml đường cà phê → Khuấy đều bằng thìa.',
      '🧊 Cho 2-3 viên đá to vào ly.',
      'Đổ từ từ phần matcha đã đánh mịn lên trên để tạo phân tầng rõ rệt.',
      '🌸 DÉCOR: 1 bông hoa violet.',
      '📉 GIẢM NGỌT 50%: 5ml đường cà phê.',
      '📉 GIẢM NGỌT 0%: 0ml đường.'
    ]
  },

  {
    id: 'r_matcha_latte',
    name: 'Matcha Latte (Sữa Tươi / Sữa Hạt)',
    category: 'Tea',
    icon: '🍵',
    tags: ['Sữa Tươi / Hạt'],
    ingredients: [
      { name: 'Bột matcha', amount: '4g' },
      { name: 'Sữa tươi hoặc sữa hạt', amount: '120ml' },
      { name: 'Sữa đặc', amount: '10ml (chuẩn) / 5ml (50%) / 0ml (0%)' },
      { name: 'Đá viên to', amount: '3 viên' },
      { name: 'Hoa violet (décor)', amount: '1 bông' }
    ],
    steps: [
      '🍵 Rây 4g bột matcha vào bát/ly, pha với một ít nước ấm rồi đánh mịn bằng chổi chasen.',
      'Cho 3 viên đá to vào ly phục vụ.',
      'Đổ 120ml sữa tươi (hoặc sữa hạt) vào ly + thêm 10ml sữa đặc, khuấy nhẹ.',
      'Đổ nhẹ nhàng phần matcha đã pha lên trên.',
      '🌸 DÉCOR: 1 bông hoa violet.',
      '📉 GIẢM NGỌT 50%: 5ml sữa đặc.',
      '📉 GIẢM NGỌT 0%: 0ml sữa đặc.'
    ]
  },

  {
    id: 'r_mot_ngum_da',
    name: 'Một Ngụm - Đá (Trà Hoa Dành Dành)',
    category: 'Tea',
    icon: '🌸',
    tags: ['Đá', 'Trà Hoa Dành Dành'],
    ingredients: [
      { name: 'Cốt trà hoa dành dành', amount: '150ml' },
      { name: 'Bột sữa', amount: '25g' },
      { name: 'Muối hồng', amount: '1 thìa mini' },
      { name: 'Sữa đặc', amount: '20ml' },
      { name: 'Đường hoa quả', amount: '10ml (chuẩn) / 5ml (50%) / 0ml (0%)' },
      { name: 'Đá viên to', amount: '4-5 viên' }
    ],
    steps: [
      '🧊 Cho 150ml cốt trà hoa dành dành vào ly/ca đong.',
      'Thêm 25g bột sữa + 1 thìa muối hồng (thìa mini) + 20ml sữa đặc + 10ml đường hoa quả.',
      'Khuấy tan hoàn toàn các nguyên liệu.',
      'Cho 4-5 viên đá to, khuấy đều và phục vụ.',
      '📉 GIẢM NGỌT 50%: 20ml sữa đặc + 5ml đường hoa quả.',
      '📉 GIẢM NGỌT 0%: 20ml sữa đặc (không dùng đường hoa quả).'
    ]
  },

  {
    id: 'r_mot_ngum_nong',
    name: 'Một Ngụm - Nóng (Trà Hoa Dành Dành)',
    category: 'Tea',
    icon: '🔥',
    tags: ['Nóng', 'Trà Hoa Dành Dành'],
    ingredients: [
      { name: 'Cốt trà hoa dành dành', amount: '150ml' },
      { name: 'Nước nóng 90°C', amount: '50ml' },
      { name: 'Bột sữa', amount: '25g' },
      { name: 'Muối hồng', amount: '1 thìa mini' },
      { name: 'Sữa đặc', amount: '20ml' },
      { name: 'Đường hoa quả', amount: '5ml (chuẩn) / 2,5ml (50%) / 0ml (0%)' }
    ],
    steps: [
      '🔥 Đổ 150ml cốt trà hoa dành dành + 50ml nước nóng 90°C vào ca đánh.',
      'Thêm 25g bột sữa + 1 thìa muối hồng (thìa mini) + 20ml sữa đặc + 5ml đường hoa quả.',
      'Khuấy tan kỹ bột sữa và sữa đặc, kiểm tra độ nóng.',
      'Rót ra ly sứ giữ nhiệt và phục vụ nóng.',
      '📉 GIẢM NGỌT 50%: 20ml sữa đặc + 2,5ml đường hoa quả.',
      '📉 GIẢM NGỌT 0%: 20ml sữa đặc (không dùng đường hoa quả).'
    ]
  },

  {
    id: 'r_chut_may',
    name: 'Chút Mây (Trà Dành Dành Kem Cheese)',
    category: 'Tea',
    icon: '☁️',
    tags: ['Kem Cheese', 'Trà Hoa'],
    ingredients: [
      { name: 'Cốt trà hoa dành dành', amount: '100ml' },
      { name: 'Nước lọc', amount: '50ml' },
      { name: 'Đường hoa quả', amount: '10ml (chuẩn) / 5ml (50%) / 0ml (0%)' },
      { name: 'Đá viên to', amount: '3 viên' },
      { name: 'Kem cheese', amount: '45-50g' },
      { name: 'Bột matcha (décor)', amount: '1 chút rắc mặt' },
      { name: 'Hoa violet (décor)', amount: '1 bông' }
    ],
    steps: [
      '🧊 Cho 3 viên đá to vào ly phục vụ.',
      'Đổ 100ml cốt trà hoa dành dành + 50ml nước lọc + 10ml đường hoa quả.',
      'Dùng thìa khuấy nhẹ cho tan đường.',
      '☁️ Rót 45-50g kem cheese sánh mịn phủ đều lên bề mặt trà.',
      'Rắc 1 chút bột matcha lên bề mặt kem cheese.',
      '🌸 DÉCOR: Cài 1 bông hoa violet.',
      '⚠️ CHÚ Ý BẮT BUỘC: Chỉ được dùng thìa ngoáy nhẹ trà, TUYỆT ĐỐI KHÔNG đánh bọt!',
      '📉 GIẢM NGỌT 50%: 5ml đường hoa quả.',
      '📉 GIẢM NGỌT 0%: Không dùng đường hoa quả.'
    ]
  },

  /* =========================================
     🍹 NHÓM 3: MOCKTAIL & SMOOTHIE (KHÁC)
     ========================================= */

  {
    id: 'r007',
    name: 'Virgin Mojito',
    category: 'Mocktail',
    icon: '🍹',
    tags: ['Mocktail'],
    ingredients: [
      { name: 'Lá bạc hà tươi', amount: '15 lá' },
      { name: 'Chanh tươi', amount: '1/2 quả' },
      { name: 'Siro mía', amount: '20ml' },
      { name: 'Soda không đường', amount: '150ml' },
      { name: 'Đá viên nghiền', amount: '1 ly' }
    ],
    steps: [
      'Cho bạc hà vào ly, ép nhẹ để tiết tinh dầu.',
      'Vắt chanh tươi trực tiếp vào ly.',
      'Thêm siro mía, khuấy đều.',
      'Đổ đá nghiền vào đầy ly.',
      'Rót soda từ từ theo thành ly.',
      'Trang trí với lá bạc hà và lát chanh.'
    ]
  },

  {
    id: 'r008',
    name: 'Blue Lemonade',
    category: 'Mocktail',
    icon: '🧊',
    tags: ['Mocktail'],
    ingredients: [
      { name: 'Nước chanh vàng', amount: '60ml' },
      { name: 'Siro bạc hà xanh', amount: '15ml' },
      { name: 'Nước soda xanh lam', amount: '200ml' },
      { name: 'Đường', amount: '10g' },
      { name: 'Đá viên', amount: 'Vừa đủ' }
    ],
    steps: [
      'Hòa tan đường trong nước chanh.',
      'Cho đá vào ly, rót nước chanh vào.',
      'Thêm siro bạc hà xanh.',
      'Đổ soda xanh lam từ từ.',
      'Khuấy nhẹ và phục vụ.'
    ]
  },

  {
    id: 'r006',
    name: 'Strawberry Smoothie',
    category: 'Smoothie',
    icon: '🍓',
    tags: ['Smoothie'],
    ingredients: [
      { name: 'Dâu tây tươi', amount: '150g' },
      { name: 'Chuối chín', amount: '1 quả' },
      { name: 'Sữa chua Hy Lạp', amount: '100g' },
      { name: 'Mật ong', amount: '20ml' },
      { name: 'Đá viên', amount: '100g' }
    ],
    steps: [
      'Rửa sạch và bỏ cuống dâu tây.',
      'Cho tất cả nguyên liệu vào máy xay.',
      'Xay ở tốc độ cao 60 giây đến khi mịn.',
      'Kiểm tra độ ngọt, điều chỉnh mật ong nếu cần.',
      'Đổ ra ly và phục vụ ngay.'
    ]
  }
];

/* =============================================================
   PHẦN 2: LỚP QUẢN LÝ DỮ LIỆU (LocalStorage Database Layer)
   ============================================================= */

/**
 * Lấy toàn bộ công thức từ localStorage.
 * Nếu chưa có dữ liệu, khởi tạo từ SAMPLE_RECIPES và lưu vào.
 * @returns {Array} Mảng các đối tượng công thức
 */
function getRecipes() {
  const raw = localStorage.getItem(LS_KEY_RECIPES);
  if (!raw) {
    localStorage.setItem(LS_KEY_RECIPES, JSON.stringify(SAMPLE_RECIPES));
    localStorage.setItem(LS_KEY_VERSION, CURRENT_DATA_VERSION.toString());
    return SAMPLE_RECIPES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Tự động đồng bộ và nâng cấp dữ liệu:
 * Cập nhật các công thức mẫu mới nhất (v3), bảo toàn các công thức tự thêm của người dùng.
 */
function autoSyncRecipes() {
  const storedVer = parseInt(localStorage.getItem(LS_KEY_VERSION) || '0', 10);
  if (storedVer < CURRENT_DATA_VERSION) {
    const existing = getRecipes();
    const sampleIds = new Set(SAMPLE_RECIPES.map(r => r.id));
    // Giữ các công thức tùy chỉnh người dùng tạo thêm
    const customUserRecipes = existing.filter(r => !sampleIds.has(r.id) && !r.id.startsWith('r0') && !r.id.startsWith('r_'));
    const merged = [...SAMPLE_RECIPES, ...customUserRecipes];
    saveRecipes(merged);
    localStorage.setItem(LS_KEY_VERSION, CURRENT_DATA_VERSION.toString());
    console.log(`☕ Barista Trainer: Đã tự động đồng bộ Menu chuẩn v${CURRENT_DATA_VERSION} (${merged.length} công thức).`);
  }
}

/**
 * Khôi phục / Cập nhật Menu Chuẩn khi người dùng bấm nút trên giao diện.
 */
function resetToDefaultMenu() {
  const existing = getRecipes();
  const sampleIds = new Set(SAMPLE_RECIPES.map(r => r.id));
  const customUserRecipes = existing.filter(r => !sampleIds.has(r.id) && !r.id.startsWith('r0') && !r.id.startsWith('r_'));
  const updated = [...SAMPLE_RECIPES, ...customUserRecipes];
  saveRecipes(updated);
  localStorage.setItem(LS_KEY_VERSION, CURRENT_DATA_VERSION.toString());
  renderRecipeLibrary();
  showToast(`✅ Đã đồng bộ toàn bộ Menu Cà Phê & Trà chuẩn (${SAMPLE_RECIPES.length} món)!`, 'success', 4000);
}

/**
 * Lưu toàn bộ mảng công thức vào localStorage.
 * @param {Array} recipes - Mảng công thức cần lưu
 */
function saveRecipes(recipes) {
  localStorage.setItem(LS_KEY_RECIPES, JSON.stringify(recipes));
}

/**
 * Thêm một công thức mới vào cơ sở dữ liệu.
 * Tạo id duy nhất dựa trên timestamp.
 * @param {Object} recipeData - Dữ liệu công thức (không có id)
 * @returns {Object} Công thức đã được gán id
 */
function addRecipe(recipeData) {
  const recipes = getRecipes();
  const newRecipe = {
    ...recipeData,
    id: 'r' + Date.now().toString(36) // ID ngắn dạng base36
  };
  recipes.push(newRecipe);
  saveRecipes(recipes);
  return newRecipe;
}

/**
 * Cập nhật công thức theo id.
 * @param {string} id - ID công thức cần cập nhật
 * @param {Object} updatedData - Dữ liệu mới
 */
function updateRecipe(id, updatedData) {
  const recipes = getRecipes();
  const idx = recipes.findIndex(r => r.id === id);
  if (idx > -1) {
    recipes[idx] = { ...recipes[idx], ...updatedData };
    saveRecipes(recipes);
  }
}

/**
 * Xóa công thức theo id.
 * @param {string} id - ID công thức cần xóa
 */
function deleteRecipe(id) {
  const recipes = getRecipes().filter(r => r.id !== id);
  saveRecipes(recipes);
}

/**
 * Lấy điểm tích lũy của người chơi từ localStorage.
 * @returns {number} Tổng điểm
 */
function getScore() {
  return parseInt(localStorage.getItem(LS_KEY_SCORE) || '0', 10);
}

/**
 * Cộng điểm vào tổng điểm lưu trong localStorage.
 * @param {number} pts - Số điểm cần cộng (có thể âm để trừ)
 */
function addScore(pts) {
  const current = getScore();
  const newScore = Math.max(0, current + pts); // Không cho điểm âm
  localStorage.setItem(LS_KEY_SCORE, newScore.toString());
  return newScore;
}

/** Lấy chuỗi thắng liên tiếp */
function getStreak() {
  return parseInt(localStorage.getItem(LS_KEY_STREAK) || '0', 10);
}

/** Cập nhật chuỗi thắng */
function setStreak(val) {
  localStorage.setItem(LS_KEY_STREAK, val.toString());
}

/** Lấy lịch sử import */
function getImportHistory() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY_HISTORY) || '[]');
  } catch { return []; }
}

/** Thêm một mục vào lịch sử import */
function addImportHistory(item) {
  const history = getImportHistory();
  history.unshift(item); // Thêm vào đầu danh sách
  if (history.length > 20) history.pop(); // Giữ tối đa 20 mục
  localStorage.setItem(LS_KEY_HISTORY, JSON.stringify(history));
}

/* =============================================================
   PHẦN 3: TIỆN ÍCH & HELPER FUNCTIONS
   ============================================================= */

/**
 * Tạo một ID ngẫu nhiên ngắn (dùng cho các phần tử động).
 * @returns {string}
 */
function uid() {
  return 'id_' + Math.random().toString(36).substr(2, 8);
}

/**
 * Lấy icon emoji tương ứng với danh mục.
 * @param {string} category
 * @returns {string} Emoji
 */
function getCategoryIcon(category) {
  const map = { Coffee: '☕', Tea: '🍵', Mocktail: '🍹', Smoothie: '🥤' };
  return map[category] || '🍶';
}

/**
 * Lấy class CSS badge theo danh mục.
 * @param {string} category
 * @returns {string}
 */
function getCategoryBadgeClass(category) {
  const map = {
    Coffee: 'badge-coffee',
    Tea: 'badge-tea',
    Mocktail: 'badge-mocktail',
    Smoothie: 'badge-smoothie'
  };
  return map[category] || 'badge-coffee';
}

/**
 * Chọn ngẫu nhiên n phần tử từ mảng (không lặp lại).
 * Dùng để tạo nguyên liệu "bẫy" trong game.
 * @param {Array} arr - Mảng gốc
 * @param {number} n - Số phần tử cần lấy
 * @returns {Array}
 */
function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

/**
 * Trộn ngẫu nhiên thứ tự mảng (Fisher-Yates Shuffle).
 * @param {Array} arr
 * @returns {Array}
 */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Chuẩn hóa chuỗi để so khớp không phân biệt hoa/thường và dấu.
 * Loại bỏ khoảng trắng thừa, chuyển về chữ thường.
 * Dùng trong Game 2 để so sánh nguyên liệu người dùng nhập.
 * @param {string} str
 * @returns {string}
 */
function normalizeStr(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu thanh tiếng Việt
    .replace(/[đĐ]/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Kiểm tra hai chuỗi có khớp nhau không (sau khi chuẩn hóa).
 * Cho phép sai lệch nhỏ: nếu chuỗi A chứa B hoặc ngược lại.
 * @param {string} a - Chuỗi người dùng nhập
 * @param {string} b - Chuỗi trong dữ liệu gốc
 * @returns {boolean}
 */
function fuzzyMatch(a, b) {
  const na = normalizeStr(a);
  const nb = normalizeStr(b);
  return na === nb || na.includes(nb) || nb.includes(na);
}

/**
 * Format thời gian thành chuỗi "HH:MM - DD/MM/YYYY".
 * @param {number} timestamp
 * @returns {string}
 */
function formatTime(timestamp) {
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const yy = d.getFullYear();
  return `${hh}:${mm} – ${dd}/${mo}/${yy}`;
}

/* =============================================================
   PHẦN 4: HÀM UI CHUNG (Toast, Modal, Loading, Confetti)
   ============================================================= */

let toastTimer = null;

/**
 * Hiển thị thông báo toast popup nhỏ ở góc màn hình.
 * @param {string} message - Nội dung thông báo
 * @param {'success'|'error'|'warning'|'info'} type - Loại toast
 * @param {number} duration - Thời gian hiển thị (ms)
 */
function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.getElementById('toast');
  toast.className = `toast ${type} show`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Mở modal thêm/sửa công thức.
 * Nếu truyền recipe sẽ điền sẵn dữ liệu để chỉnh sửa.
 * @param {Object|null} recipe - Công thức cần chỉnh sửa, hoặc null để thêm mới
 */
function openRecipeModal(recipe = null) {
  const modal = document.getElementById('recipe-modal');
  const title = document.getElementById('modal-title');
  const nameInput = document.getElementById('recipe-name');
  const categorySelect = document.getElementById('recipe-category');

  // Đặt chế độ (thêm mới hoặc sửa)
  modal.dataset.editId = recipe ? recipe.id : '';
  title.textContent = recipe ? '✏️ Chỉnh Sửa Công Thức' : '✨ Thêm Công Thức Mới';

  // Điền sẵn dữ liệu nếu đang sửa
  nameInput.value = recipe ? recipe.name : '';
  categorySelect.value = recipe ? recipe.category : 'Coffee';

  // Render danh sách nguyên liệu
  renderDynamicList(
    'ingredients-list',
    recipe ? recipe.ingredients : [{ name: '', amount: '' }],
    renderIngredientRow
  );

  // Render danh sách bước thực hiện
  renderDynamicList(
    'steps-list',
    recipe ? recipe.steps.map(s => ({ step: s })) : [{ step: '' }],
    renderStepRow
  );

  modal.classList.add('open');
  nameInput.focus();
}

/** Đóng modal thêm/sửa */
function closeRecipeModal() {
  document.getElementById('recipe-modal').classList.remove('open');
}

/**
 * Mở modal xem chi tiết công thức.
 * @param {Object} recipe - Đối tượng công thức cần xem
 */
function openDetailModal(recipe) {
  const modal = document.getElementById('detail-modal');
  const title = document.getElementById('detail-modal-title');
  const body = document.getElementById('detail-modal-body');

  title.textContent = `${recipe.icon || getCategoryIcon(recipe.category)} ${recipe.name}`;

  // Build HTML chi tiết nguyên liệu
  const ingredientsHTML = recipe.ingredients.map(ing => `
    <div class="detail-ingredient-item">
      <span class="detail-ingredient-name">🔹 ${escapeHtml(ing.name)}</span>
      <span class="detail-ingredient-amount">${escapeHtml(ing.amount)}</span>
    </div>
  `).join('');

  // Build HTML các bước thực hiện
  const stepsHTML = recipe.steps.map((step, i) => `
    <div class="detail-step-item">
      <span class="step-number">${i + 1}</span>
      <span class="step-text">${escapeHtml(step)}</span>
    </div>
  `).join('');

  const tagsHTML = (recipe.tags || []).map(t => `
    <span class="ingredient-tag" style="border-color:var(--border-strong); color:var(--accent-light); font-weight:600;">🏷️ ${escapeHtml(t)}</span>
  `).join('');

  body.innerHTML = `
    <div class="detail-body">
      <div class="detail-hero">
        <span class="detail-hero-icon">${recipe.icon || getCategoryIcon(recipe.category)}</span>
        <h2 class="detail-hero-name">${escapeHtml(recipe.name)}</h2>
        <span class="recipe-category-badge ${getCategoryBadgeClass(recipe.category)}">
          ${recipe.category}
        </span>
      </div>
      ${tagsHTML ? `<div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:16px;">${tagsHTML}</div>` : ''}
      <div class="detail-section">
        <h4>🧪 Nguyên Liệu (${recipe.ingredients.length} thành phần)</h4>
        <div class="detail-ingredients-list">${ingredientsHTML}</div>
      </div>
      <div class="detail-section">
        <h4>📋 Cách Thực Hiện & Lưu Ý</h4>
        <div class="detail-steps-list">${stepsHTML}</div>
      </div>
      <div style="display:flex; gap:10px; margin-top:20px; flex-wrap:wrap;">
        <button class="btn-primary" style="flex:1; min-width:180px;" onclick="closeDetailModal(); switchTab('game1'); startGame1('${recipe.id}');">
          🎯 Luyện Select & Mix
        </button>
        <button class="btn-primary" style="flex:1; min-width:180px; background:linear-gradient(135deg,#ef4444,#dc2626);" onclick="closeDetailModal(); switchTab('game2'); startGame2('${recipe.id}');">
          🧠 Luyện Recall & Type
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

/** Đóng modal chi tiết */
function closeDetailModal() {
  document.getElementById('detail-modal').classList.remove('open');
}

/**
 * Hiệu ứng Confetti khi người chơi thắng.
 * Tạo 80 mảnh giấy nhiều màu rơi từ trên xuống.
 */
function launchConfetti() {
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';
  const colors = ['#d97706', '#f59e0b', '#22c55e', '#3b82f6', '#ec4899', '#a855f7', '#ef4444', '#fbbf24'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      top: -20px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      --tx: ${(Math.random() - 0.5) * 200}px;
      --rot: ${Math.random() * 1080}deg;
      animation-duration: ${1.5 + Math.random() * 2.5}s;
      animation-delay: ${Math.random() * 0.8}s;
    `;
    container.appendChild(piece);
  }

  // Dọn sạch sau 5 giây
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}

/**
 * Hiển thị/ẩn màn hình loading chính (khi app khởi động).
 * @param {boolean} show
 */
function toggleLoadingOverlay(show) {
  const overlay = document.getElementById('loading-overlay');
  if (show) {
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
    // Xóa hoàn toàn sau khi animation xong
    setTimeout(() => { overlay.style.display = 'none'; }, 600);
  }
}

/* =============================================================
   PHẦN 5: QUẢN LÝ ĐIỀU HƯỚNG (Tab Switching & Mobile Menu)
   ============================================================= */

let currentTab = 'dashboard'; // Tab hiện tại

/**
 * Chuyển đổi giữa các tab chính (Dashboard, Import, Game 1, Game 2).
 * Cập nhật class active trên nav items và hiển thị section tương ứng.
 * @param {string} tabName - Tên tab cần chuyển đến
 */
function switchTab(tabName) {
  // Ẩn tất cả tab sections
  document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
  // Bỏ active tất cả nav items
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  // Hiện tab được chọn
  const section = document.getElementById(`tab-${tabName}`);
  if (section) section.classList.add('active');

  // Đánh dấu nav item tương ứng
  const navBtn = document.getElementById(`nav-${tabName}`);
  if (navBtn) {
    navBtn.classList.add('active');
    navBtn.setAttribute('aria-selected', 'true');
  }

  currentTab = tabName;

  // Đóng sidebar trên mobile khi chọn tab
  closeMobileSidebar();

  // Làm mới nội dung tab nếu cần
  if (tabName === 'dashboard') renderRecipeLibrary();
  if (tabName === 'import') renderImportHistory();
  if (tabName === 'brewing') renderBrewingRecipes();
}

/* =============================================================
   PHẦN 5A: HỖ TRỢ Ủ TRÀ & ĐỒNG HỒ ĐẾM NGƯỢC
   ============================================================= */

const brewingTimerState = {
  intervalId: null,
  endAt: null,
  remainingMs: 0,
  status: 'idle',
  selectedRecipeId: null,
  editingRecipeId: null
};

function getBrewingRecipes() {
  const raw = localStorage.getItem(LS_KEY_BREWING_RECIPES);
  if (!raw) return [];

  try {
    const recipes = JSON.parse(raw);
    if (!Array.isArray(recipes)) throw new TypeError('Brewing recipes must be an array.');
    return recipes.filter(recipe => recipe && typeof recipe.id === 'string' && typeof recipe.name === 'string');
  } catch (error) {
    console.error('Không thể đọc danh sách công thức ủ trà:', error);
    return [];
  }
}

function saveBrewingRecipes(recipes) {
  try {
    localStorage.setItem(LS_KEY_BREWING_RECIPES, JSON.stringify(recipes));
    return true;
  } catch (error) {
    console.error('Không thể lưu danh sách công thức ủ trà:', error);
    showToast('Không thể lưu công thức ủ trà vào trình duyệt.', 'error');
    return false;
  }
}

function formatBrewingTime(milliseconds) {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getSelectedBrewingRecipe() {
  return getBrewingRecipes().find(recipe => recipe.id === brewingTimerState.selectedRecipeId) || null;
}

function getBrewingDuration() {
  const recipe = getSelectedBrewingRecipe();
  if (!recipe) return null;
  return (recipe.minutes * 60 + recipe.seconds) * 1000;
}

function updateBrewingTimerDisplay() {
  const recipe = getSelectedBrewingRecipe();
  document.getElementById('brewing-countdown').textContent =
    formatBrewingTime(brewingTimerState.remainingMs);

  const statusText = {
    idle: 'Sẵn sàng ủ trà',
    running: 'Đang ủ trà...',
    paused: 'Đã tạm dừng',
    completed: 'Trà đã ủ xong!'
  };
  document.getElementById('brewing-status').textContent = statusText[brewingTimerState.status];
  document.getElementById('brewing-start-btn').disabled = !recipe || brewingTimerState.status === 'running';
  document.getElementById('brewing-start-btn').textContent =
    brewingTimerState.status === 'paused' ? '▶ Tiếp tục' : '▶ Bắt đầu ủ';
  document.getElementById('brewing-pause-btn').disabled = brewingTimerState.status !== 'running';

  const formDisabled = brewingTimerState.status === 'running';
  document.querySelectorAll('#brewing-settings-form input, #brewing-settings-form textarea, #brewing-save-btn, #brewing-cancel-edit-btn, .brewing-recipe-card button')
    .forEach(control => { control.disabled = formDisabled; });
}

function resetBrewingTimer() {
  clearInterval(brewingTimerState.intervalId);
  brewingTimerState.intervalId = null;
  brewingTimerState.endAt = null;
  brewingTimerState.remainingMs = getBrewingDuration() || 0;
  brewingTimerState.status = 'idle';
  updateBrewingTimerDisplay();
}

function tickBrewingTimer() {
  brewingTimerState.remainingMs = Math.max(0, brewingTimerState.endAt - Date.now());
  if (brewingTimerState.remainingMs === 0) {
    clearInterval(brewingTimerState.intervalId);
    brewingTimerState.intervalId = null;
    brewingTimerState.endAt = null;
    brewingTimerState.status = 'completed';
    showToast('Thời gian ủ trà đã hết!', 'success');
  }
  updateBrewingTimerDisplay();
}

function startBrewingTimer() {
  if (brewingTimerState.status === 'running') return;

  const recipe = getSelectedBrewingRecipe();
  if (!recipe) {
    showToast('Hãy chọn một công thức ủ trà trước.', 'warning');
    return;
  }

  if (brewingTimerState.status !== 'paused') {
    const duration = getBrewingDuration();
    if (!Number.isFinite(duration) || duration <= 0 || duration > 86400000) {
      showToast('Thời gian ủ trong công thức không hợp lệ.', 'warning');
      return;
    }
    brewingTimerState.remainingMs = duration;
  }

  brewingTimerState.endAt = Date.now() + brewingTimerState.remainingMs;
  brewingTimerState.status = 'running';
  brewingTimerState.intervalId = setInterval(tickBrewingTimer, 250);
  updateBrewingTimerDisplay();
}

function pauseBrewingTimer() {
  if (brewingTimerState.status !== 'running') return;

  brewingTimerState.remainingMs = Math.max(0, brewingTimerState.endAt - Date.now());
  clearInterval(brewingTimerState.intervalId);
  brewingTimerState.intervalId = null;
  brewingTimerState.endAt = null;
  brewingTimerState.status = 'paused';
  updateBrewingTimerDisplay();
}

function selectBrewingRecipe(recipeId) {
  if (brewingTimerState.status === 'running') {
    showToast('Hãy tạm dừng hoặc đặt lại đồng hồ trước khi đổi công thức.', 'warning');
    return;
  }

  const recipe = getBrewingRecipes().find(item => item.id === recipeId);
  if (!recipe) return;
  brewingTimerState.selectedRecipeId = recipe.id;
  resetBrewingTimer();
  renderBrewingRecipes();
}

function renderBrewingRecipes() {
  const recipes = getBrewingRecipes();
  const list = document.getElementById('brewing-recipes-list');
  const selectedRecipe = recipes.find(recipe => recipe.id === brewingTimerState.selectedRecipeId);
  const count = document.getElementById('brewing-recipe-count');
  const selectedName = document.getElementById('brewing-selected-name');
  const selectedDetails = document.getElementById('brewing-selected-details');

  list.replaceChildren();
  count.textContent = `${recipes.length} công thức`;
  if (!selectedRecipe) {
    brewingTimerState.selectedRecipeId = null;
    selectedName.textContent = 'Chọn công thức để bắt đầu';
    selectedDetails.textContent = 'Chọn một công thức bên dưới để xem tỉ lệ trà, nước và nhiệt độ.';
    if (brewingTimerState.status !== 'running') {
      brewingTimerState.remainingMs = 0;
      brewingTimerState.status = 'idle';
      updateBrewingTimerDisplay();
    }
  }

  if (selectedRecipe) {
    selectedName.textContent = selectedRecipe.name;
    selectedDetails.textContent =
      `${selectedRecipe.teaType} · ${selectedRecipe.teaAmount} g trà / ${selectedRecipe.waterAmount} ml nước · ${selectedRecipe.temperature}°C`;
  }

  if (!recipes.length) {
    const empty = document.createElement('p');
    empty.className = 'brewing-empty';
    empty.textContent = 'Chưa có công thức ủ trà. Thêm công thức của quán ở khung bên trên; danh sách sẽ được lưu trên thiết bị này.';
    list.appendChild(empty);
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement('article');
    card.className = `brewing-recipe-card${recipe.id === brewingTimerState.selectedRecipeId ? ' selected' : ''}`;

    const heading = document.createElement('h3');
    heading.textContent = recipe.name;
    const details = document.createElement('p');
    details.textContent = `${recipe.teaType} · ${recipe.teaAmount} g trà / ${recipe.waterAmount} ml nước · ${recipe.temperature}°C · ${formatBrewingTime((recipe.minutes * 60 + recipe.seconds) * 1000)}`;

    const steps = document.createElement('ol');
    steps.className = 'brewing-recipe-steps';
    (recipe.steps || []).forEach(step => {
      const item = document.createElement('li');
      item.textContent = step;
      steps.appendChild(item);
    });

    const actions = document.createElement('div');
    actions.className = 'brewing-recipe-actions';
    const selectButton = document.createElement('button');
    selectButton.className = 'btn-primary';
    selectButton.type = 'button';
    selectButton.textContent = recipe.id === brewingTimerState.selectedRecipeId ? 'Đang chọn' : 'Dùng công thức';
    selectButton.disabled = recipe.id === brewingTimerState.selectedRecipeId || brewingTimerState.status === 'running';
    selectButton.addEventListener('click', () => selectBrewingRecipe(recipe.id));

    const editButton = document.createElement('button');
    editButton.className = 'btn-secondary';
    editButton.type = 'button';
    editButton.textContent = 'Sửa';
    editButton.disabled = brewingTimerState.status === 'running';
    editButton.addEventListener('click', () => editBrewingRecipe(recipe.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-danger';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Xóa';
    deleteButton.disabled = brewingTimerState.status === 'running';
    deleteButton.addEventListener('click', () => deleteBrewingRecipe(recipe.id));

    actions.append(selectButton, editButton, deleteButton);
    card.append(heading, details);
    if (steps.childElementCount) card.appendChild(steps);
    card.appendChild(actions);
    list.appendChild(card);
  });
}

function resetBrewingRecipeForm() {
  brewingTimerState.editingRecipeId = null;
  document.getElementById('brewing-form-title').textContent = 'Thêm công thức ủ trà';
  document.getElementById('brewing-save-btn').textContent = '💾 Lưu công thức';
  document.getElementById('brewing-cancel-edit-btn').hidden = true;
  document.getElementById('brewing-name').value = '';
  document.getElementById('brewing-tea-type').value = '';
  document.getElementById('brewing-tea-amount').value = '';
  document.getElementById('brewing-water-amount').value = '';
  document.getElementById('brewing-temperature').value = '';
  document.getElementById('brewing-minutes').value = '3';
  document.getElementById('brewing-seconds').value = '0';
  document.getElementById('brewing-steps').value = '';
}

function editBrewingRecipe(recipeId) {
  const recipe = getBrewingRecipes().find(item => item.id === recipeId);
  if (!recipe) return;

  brewingTimerState.editingRecipeId = recipe.id;
  document.getElementById('brewing-form-title').textContent = 'Chỉnh sửa công thức ủ trà';
  document.getElementById('brewing-save-btn').textContent = '💾 Cập nhật công thức';
  document.getElementById('brewing-cancel-edit-btn').hidden = false;
  document.getElementById('brewing-name').value = recipe.name;
  document.getElementById('brewing-tea-type').value = recipe.teaType;
  document.getElementById('brewing-tea-amount').value = recipe.teaAmount;
  document.getElementById('brewing-water-amount').value = recipe.waterAmount;
  document.getElementById('brewing-temperature').value = recipe.temperature;
  document.getElementById('brewing-minutes').value = recipe.minutes;
  document.getElementById('brewing-seconds').value = recipe.seconds;
  document.getElementById('brewing-steps').value = (recipe.steps || []).join('\n');
  document.getElementById('brewing-name').focus();
}

function saveBrewingRecipeFromForm() {
  const name = document.getElementById('brewing-name').value.trim();
  const teaType = document.getElementById('brewing-tea-type').value.trim();
  const teaAmount = Number(document.getElementById('brewing-tea-amount').value);
  const waterAmount = Number(document.getElementById('brewing-water-amount').value);
  const temperature = Number(document.getElementById('brewing-temperature').value);
  const minutes = Number(document.getElementById('brewing-minutes').value);
  const seconds = Number(document.getElementById('brewing-seconds').value);

  if (!name || !teaType || !Number.isFinite(teaAmount) || teaAmount <= 0 ||
      !Number.isFinite(waterAmount) || waterAmount <= 0 ||
      !Number.isInteger(temperature) || temperature < 1 || temperature > 100 ||
      !Number.isInteger(minutes) || minutes < 0 ||
      !Number.isInteger(seconds) || seconds < 0 || seconds > 59 ||
      minutes * 60 + seconds <= 0 || minutes * 60 + seconds > 86400) {
    showToast('Hãy nhập tên, loại trà, định lượng, nhiệt độ và thời gian ủ hợp lệ.', 'warning');
    return;
  }

  const recipes = getBrewingRecipes();
  const recipe = {
    id: brewingTimerState.editingRecipeId || uid(),
    name,
    teaType,
    teaAmount,
    waterAmount,
    temperature,
    minutes,
    seconds,
    steps: document.getElementById('brewing-steps').value.split('\n').map(step => step.trim()).filter(Boolean)
  };
  const existingIndex = recipes.findIndex(item => item.id === recipe.id);
  if (existingIndex >= 0) recipes[existingIndex] = recipe;
  else recipes.unshift(recipe);

  if (!saveBrewingRecipes(recipes)) return;
  brewingTimerState.selectedRecipeId = recipe.id;
  resetBrewingRecipeForm();
  renderBrewingRecipes();
  resetBrewingTimer();
  showToast(existingIndex >= 0 ? 'Đã cập nhật công thức ủ trà.' : 'Đã lưu công thức ủ trà.', 'success');
}

function deleteBrewingRecipe(recipeId) {
  const recipe = getBrewingRecipes().find(item => item.id === recipeId);
  if (!recipe || !confirm(`Xóa công thức "${recipe.name}"?`)) return;

  const recipes = getBrewingRecipes().filter(item => item.id !== recipeId);
  if (!saveBrewingRecipes(recipes)) return;
  if (brewingTimerState.selectedRecipeId === recipeId) {
    brewingTimerState.selectedRecipeId = null;
    resetBrewingTimer();
  }
  if (brewingTimerState.editingRecipeId === recipeId) resetBrewingRecipeForm();
  renderBrewingRecipes();
  showToast('Đã xóa công thức ủ trà.', 'success');
}

/** Mở sidebar trên mobile */
function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-backdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Đóng sidebar trên mobile */
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-backdrop').classList.remove('open');
  document.body.style.overflow = '';
}

/* =============================================================
   PHẦN 6: RENDER THƯ VIỆN CÔNG THỨC (Dashboard)
   ============================================================= */

let currentFilter = 'all'; // Bộ lọc danh mục hiện tại
let currentSearchTerm = '';  // Từ khóa tìm kiếm hiện tại

/**
 * Render lưới tất cả công thức trong thư viện,
 * áp dụng bộ lọc danh mục và từ khóa tìm kiếm.
 */
function renderRecipeLibrary() {
  const recipes = getRecipes();
  const grid = document.getElementById('recipes-grid');
  const empty = document.getElementById('empty-state');

  // Lọc theo danh mục
  let filtered = recipes;
  if (currentFilter === 'Coffee') {
    filtered = recipes.filter(r => r.category === 'Coffee');
  } else if (currentFilter === 'Tea') {
    filtered = recipes.filter(r => r.category === 'Tea');
  } else if (currentFilter === 'Other') {
    filtered = recipes.filter(r => r.category !== 'Coffee' && r.category !== 'Tea');
  }

  // Lọc theo từ khóa tìm kiếm (theo tên hoặc nguyên liệu)
  if (currentSearchTerm) {
    const term = normalizeStr(currentSearchTerm);
    filtered = filtered.filter(r =>
      normalizeStr(r.name).includes(term) ||
      r.ingredients.some(ing => normalizeStr(ing.name).includes(term))
    );
  }

  // Cập nhật số liệu thống kê
  updateStats(recipes);

  // Hiển thị trạng thái rỗng nếu không có công thức nào
  if (filtered.length === 0) {
    grid.innerHTML = '';
    grid.className = 'recipes-grid';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';

  // NẾU LÀ "TẤT CẢ" VÀ KHÔNG TÌM KIẾM: HIỂN THỊ PHÂN CHIA RÕ RÀNG 2 MENU CÀ PHÊ & TRÀ
  if (currentFilter === 'all' && !currentSearchTerm) {
    grid.className = 'recipes-grid recipes-grouped-mode';

    const coffeeList = recipes.filter(r => r.category === 'Coffee');
    const teaList = recipes.filter(r => r.category === 'Tea');
    const otherList = recipes.filter(r => r.category !== 'Coffee' && r.category !== 'Tea');

    let html = '';

    if (coffeeList.length > 0) {
      html += `
        <section class="menu-group-block">
          <div class="menu-group-header">
            <h2 class="menu-group-title">☕ Menu Cà Phê (Coffee Bar)</h2>
            <span class="menu-group-count">${coffeeList.length} món</span>
          </div>
          <div class="recipes-group-grid">
            ${coffeeList.map(r => buildRecipeCardHTML(r)).join('')}
          </div>
        </section>
      `;
    }

    if (teaList.length > 0) {
      html += `
        <section class="menu-group-block">
          <div class="menu-group-header menu-group-header--tea">
            <h2 class="menu-group-title">🍵 Menu Trà & Matcha (Tea Bar)</h2>
            <span class="menu-group-count">${teaList.length} món</span>
          </div>
          <div class="recipes-group-grid">
            ${teaList.map(r => buildRecipeCardHTML(r)).join('')}
          </div>
        </section>
      `;
    }

    if (otherList.length > 0) {
      html += `
        <section class="menu-group-block">
          <div class="menu-group-header menu-group-header--other">
            <h2 class="menu-group-title">🍹 Đồ Uống Khác (Mocktail & Smoothie)</h2>
            <span class="menu-group-count">${otherList.length} món</span>
          </div>
          <div class="recipes-group-grid">
            ${otherList.map(r => buildRecipeCardHTML(r)).join('')}
          </div>
        </section>
      `;
    }

    grid.innerHTML = html;
  } else {
    // Khi đang lọc theo danh mục cụ thể hoặc đang tìm kiếm
    grid.className = 'recipes-grid';
    grid.innerHTML = filtered.map(recipe => buildRecipeCardHTML(recipe)).join('');
  }
}

/**
 * Tạo HTML cho một thẻ công thức.
 * @param {Object} recipe
 * @returns {string} HTML string
 */
function buildRecipeCardHTML(recipe) {
  const icon = recipe.icon || getCategoryIcon(recipe.category);
  const badgeClass = getCategoryBadgeClass(recipe.category);

  // Hiển thị tối đa 3 tag nguyên liệu
  const maxTags = 3;
  const ingTags = recipe.ingredients.slice(0, maxTags)
    .map(ing => `<span class="ingredient-tag">${escapeHtml(ing.name)}</span>`)
    .join('');
  const moreCount = recipe.ingredients.length - maxTags;
  const moreBadge = moreCount > 0
    ? `<span class="ingredient-more">+${moreCount}</span>`
    : '';

  // Tags phân loại nếu có (Đá, Nóng, Giảm Ngọt, Chai 250ml)
  const tagsHTML = (recipe.tags || [])
    .map(t => `<span class="ingredient-tag" style="border-color:var(--border-strong); color:var(--accent-light);">🏷️ ${escapeHtml(t)}</span>`)
    .join('');

  return `
    <article class="recipe-card" role="listitem" data-id="${recipe.id}">
      <div class="recipe-card-accent"></div>
      <div class="recipe-card-body">
        <div class="recipe-card-top">
          <span class="recipe-icon">${icon}</span>
          <span class="recipe-category-badge ${badgeClass}">${recipe.category}</span>
        </div>
        <h3 class="recipe-card-name">${escapeHtml(recipe.name)}</h3>
        <div class="recipe-card-ingredients">
          ${ingTags}${moreBadge}
        </div>
        ${tagsHTML ? `<div class="recipe-card-ingredients" style="margin-top:-6px; margin-bottom:10px;">${tagsHTML}</div>` : ''}
        <div class="recipe-card-footer">
          <span class="steps-count">📋 ${recipe.steps.length} bước</span>
          <div class="recipe-card-actions">
            <button class="btn-icon btn-icon--detail" data-id="${recipe.id}" title="Xem chi tiết" aria-label="Xem chi tiết ${escapeHtml(recipe.name)}">👁</button>
            <button class="btn-icon btn-icon--edit" data-id="${recipe.id}" title="Chỉnh sửa" aria-label="Chỉnh sửa ${escapeHtml(recipe.name)}">✏️</button>
            <button class="btn-icon btn-icon--danger" data-id="${recipe.id}" title="Xóa" aria-label="Xóa ${escapeHtml(recipe.name)}">🗑</button>
          </div>
        </div>
        <div class="recipe-card-train-bar">
          <button class="btn-card-train" data-train-game="game1" data-id="${recipe.id}" title="Luyện chọn nguyên liệu cho món này">
            🎯 Luyện Select
          </button>
          <button class="btn-card-train btn-card-train--hard" data-train-game="game2" data-id="${recipe.id}" title="Luyện gõ công thức cho món này">
            🧠 Luyện Recall
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Gắn sự kiện click cho các nút trên thẻ công thức (chi tiết, sửa, xóa).
 * Dùng event delegation để hiệu quả với DOM động.
 */
function attachRecipeCardEvents() {
  // Đã xử lý tập trung trong attachRecipeCardEventsGlobal
}

/** Gắn event listener liên tục (không dùng once) */
function attachRecipeCardEventsGlobal() {
  const grid = document.getElementById('recipes-grid');
  grid.addEventListener('click', handleGridClick);
}

function handleGridClick(e) {
  const trainBtn = e.target.closest('.btn-card-train');
  const detailBtn = e.target.closest('.btn-icon--detail');
  const editBtn = e.target.closest('.btn-icon--edit');
  const deleteBtn = e.target.closest('.btn-icon--danger');
  const card = e.target.closest('.recipe-card');

  if (trainBtn) {
    e.stopPropagation();
    const recipeId = trainBtn.dataset.id;
    const gameType = trainBtn.dataset.trainGame;
    if (gameType === 'game1') {
      switchTab('game1');
      startGame1(recipeId);
    } else if (gameType === 'game2') {
      switchTab('game2');
      startGame2(recipeId);
    }
  } else if (detailBtn) {
    e.stopPropagation();
    const recipe = getRecipes().find(r => r.id === detailBtn.dataset.id);
    if (recipe) openDetailModal(recipe);
  } else if (editBtn) {
    e.stopPropagation();
    const recipe = getRecipes().find(r => r.id === editBtn.dataset.id);
    if (recipe) openRecipeModal(recipe);
  } else if (deleteBtn) {
    e.stopPropagation();
    confirmDeleteRecipe(deleteBtn.dataset.id);
  } else if (card) {
    const recipe = getRecipes().find(r => r.id === card.dataset.id);
    if (recipe) openDetailModal(recipe);
  }
}

/**
 * Xác nhận và thực hiện xóa công thức.
 * @param {string} id - ID công thức cần xóa
 */
function confirmDeleteRecipe(id) {
  const recipe = getRecipes().find(r => r.id === id);
  if (!recipe) return;

  // Dùng confirm thay cho dialog phức tạp để giữ đơn giản
  if (window.confirm(`⚠️ Bạn có chắc muốn xóa công thức "${recipe.name}" không?\n\nHành động này không thể hoàn tác!`)) {
    deleteRecipe(id);
    renderRecipeLibrary();
    showToast(`Đã xóa công thức "${recipe.name}"`, 'warning');
  }
}

/**
 * Cập nhật các số liệu thống kê trên Dashboard.
 * @param {Array} recipes - Mảng tất cả công thức
 */
function updateStats(recipes) {
  document.getElementById('stat-total').textContent = recipes.length;
  document.getElementById('stat-coffee').textContent = recipes.filter(r => r.category === 'Coffee').length;
  document.getElementById('stat-tea').textContent = recipes.filter(r => r.category === 'Tea').length;
  document.getElementById('stat-score').textContent = getScore();
  // Cập nhật điểm trên sidebar và mobile
  updateScoreDisplay();
}

/** Cập nhật hiển thị điểm trên tất cả vị trí */
function updateScoreDisplay() {
  const score = getScore();
  const streak = getStreak();
  document.getElementById('sidebar-score-display').textContent = score;
  document.getElementById('sidebar-streak').textContent = `🔥 Chuỗi: ${streak}`;
  document.getElementById('mobile-score').textContent = score;
  document.getElementById('game1-score').textContent = score;
  document.getElementById('game2-score').textContent = score;
  document.getElementById('stat-score').textContent = score;
}

/* =============================================================
   PHẦN 7: FORM ĐỘNG (Dynamic Form Rows)
   ============================================================= */

/**
 * Render danh sách động (nguyên liệu hoặc bước thực hiện).
 * @param {string} containerId - ID của container HTML
 * @param {Array} items - Mảng dữ liệu ban đầu
 * @param {Function} rowRenderer - Hàm tạo HTML cho từng hàng
 */
function renderDynamicList(containerId, items, rowRenderer) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map((item, i) => rowRenderer(item, i)).join('');
}

/**
 * Tạo HTML cho một hàng nguyên liệu trong form.
 * @param {Object} ing - { name, amount }
 * @param {number} idx - Chỉ số hàng
 * @returns {string}
 */
function renderIngredientRow(ing, idx) {
  const rowId = `ing-row-${uid()}`;
  return `
    <div class="dynamic-row" id="${rowId}">
      <input type="text" class="ing-name" placeholder="Tên nguyên liệu (VD: Sữa tươi)" value="${escapeHtml(ing.name)}" />
      <input type="text" class="ing-amount" placeholder="Định lượng (VD: 200ml)" value="${escapeHtml(ing.amount)}" />
      <button type="button" class="remove-row" title="Xóa hàng" onclick="removeRow('${rowId}')">✕</button>
    </div>
  `;
}

/**
 * Tạo HTML cho một hàng bước thực hiện trong form.
 * @param {Object} stepObj - { step: string }
 * @param {number} idx - Chỉ số hàng
 * @returns {string}
 */
function renderStepRow(stepObj, idx) {
  const rowId = `step-row-${uid()}`;
  return `
    <div class="dynamic-row" id="${rowId}">
      <input type="text" class="step-input" placeholder="Bước ${idx + 1}: Mô tả thao tác..." value="${escapeHtml(stepObj.step || '')}" />
      <button type="button" class="remove-row" title="Xóa hàng" onclick="removeRow('${rowId}')">✕</button>
    </div>
  `;
}

/**
 * Thêm một hàng nguyên liệu rỗng vào form.
 */
function addIngredientRow() {
  const container = document.getElementById('ingredients-list');
  const rowId = `ing-row-${uid()}`;
  const div = document.createElement('div');
  div.className = 'dynamic-row';
  div.id = rowId;
  div.innerHTML = `
    <input type="text" class="ing-name" placeholder="Tên nguyên liệu" />
    <input type="text" class="ing-amount" placeholder="Định lượng" />
    <button type="button" class="remove-row" onclick="removeRow('${rowId}')">✕</button>
  `;
  container.appendChild(div);
  div.querySelector('.ing-name').focus();
}

/**
 * Thêm một hàng bước rỗng vào form.
 */
function addStepRow() {
  const container = document.getElementById('steps-list');
  const rowId = `step-row-${uid()}`;
  const div = document.createElement('div');
  div.className = 'dynamic-row';
  div.id = rowId;
  const stepCount = container.querySelectorAll('.step-input').length + 1;
  div.innerHTML = `
    <input type="text" class="step-input" placeholder="Bước ${stepCount}: ..." />
    <button type="button" class="remove-row" onclick="removeRow('${rowId}')">✕</button>
  `;
  container.appendChild(div);
  div.querySelector('.step-input').focus();
}

/**
 * Xóa một hàng động khỏi form (nguyên liệu hoặc bước).
 * Đảm bảo luôn còn ít nhất 1 hàng.
 * @param {string} rowId - ID của hàng cần xóa
 */
function removeRow(rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const parent = row.parentElement;
  // Không xóa nếu chỉ còn 1 hàng
  if (parent.querySelectorAll('.dynamic-row').length <= 1) {
    showToast('Phải có ít nhất 1 mục!', 'warning');
    return;
  }
  row.remove();
}

/**
 * Escape HTML để tránh XSS khi render dữ liệu người dùng nhập.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Thu thập dữ liệu từ form modal và trả về object công thức.
 * Kiểm tra hợp lệ: tên không được rỗng, phải có ít nhất 1 nguyên liệu.
 * @returns {Object|null} Dữ liệu công thức hoặc null nếu không hợp lệ
 */
function collectFormData() {
  const name = document.getElementById('recipe-name').value.trim();
  const category = document.getElementById('recipe-category').value;

  if (!name) {
    showToast('Vui lòng nhập tên món!', 'error');
    document.getElementById('recipe-name').focus();
    return null;
  }

  // Thu thập nguyên liệu từ các hàng dynamic
  const ingRows = document.querySelectorAll('#ingredients-list .dynamic-row');
  const ingredients = [];
  ingRows.forEach(row => {
    const ingName = row.querySelector('.ing-name')?.value.trim();
    const ingAmount = row.querySelector('.ing-amount')?.value.trim();
    if (ingName) { // Bỏ qua hàng trống
      ingredients.push({ name: ingName, amount: ingAmount || '' });
    }
  });

  if (ingredients.length === 0) {
    showToast('Vui lòng thêm ít nhất 1 nguyên liệu!', 'error');
    return null;
  }

  // Thu thập các bước thực hiện
  const stepRows = document.querySelectorAll('#steps-list .step-input');
  const steps = [];
  stepRows.forEach(input => {
    const step = input.value.trim();
    if (step) steps.push(step);
  });

  return {
    name,
    category,
    icon: getCategoryIcon(category),
    ingredients,
    steps: steps.length > 0 ? steps : ['Thực hiện theo hướng dẫn.']
  };
}

/**
 * Lưu công thức từ form modal vào localStorage.
 * Phân biệt chế độ "thêm mới" và "chỉnh sửa" qua modal.dataset.editId.
 */
function saveRecipeFromModal() {
  const data = collectFormData();
  if (!data) return;

  const modal = document.getElementById('recipe-modal');
  const editId = modal.dataset.editId;

  if (editId) {
    // Chế độ chỉnh sửa: cập nhật công thức hiện có
    updateRecipe(editId, data);
    showToast(`Đã cập nhật công thức "${data.name}"!`, 'success');
  } else {
    // Chế độ thêm mới
    addRecipe(data);
    showToast(`Đã thêm công thức "${data.name}" vào thư viện!`, 'success');
  }

  closeRecipeModal();
  renderRecipeLibrary(); // Làm mới danh sách ngay lập tức
}

/* =============================================================
   PHẦN 8: SMART IMPORT – PHÂN TÍCH PDF / ẢNH
   ============================================================= */

let extractedPreviewData = null; // Dữ liệu bóc tách tạm thời

/**
 * Khởi tạo khu vực kéo thả file (Drag & Drop Zone).
 * Gắn các sự kiện dragenter, dragover, dragleave, drop.
 */
function initDropzone() {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const browseBtn = document.getElementById('browse-btn');

  // Ngăn hành vi mặc định của trình duyệt khi kéo file vào
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // Hiệu ứng hover khi kéo file vào vùng drop
  dropzone.addEventListener('dragenter', () => dropzone.classList.add('dragover'));
  dropzone.addEventListener('dragover', () => dropzone.classList.add('dragover'));
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

  // Xử lý khi thả file vào
  dropzone.addEventListener('drop', (e) => {
    dropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelected(files[0]);
  });

  // Xử lý khi nhấp vào nút Browse
  browseBtn.addEventListener('click', () => fileInput.click());

  // Xử lý khi người dùng chọn file qua input
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFileSelected(e.target.files[0]);
  });

  // Hỗ trợ truy cập bằng bàn phím (Space/Enter kích hoạt browse)
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      fileInput.click();
    }
  });
}

/**
 * Xử lý file được chọn: kiểm tra định dạng, bắt đầu quá trình phân tích.
 * @param {File} file - File đã được chọn
 */
function handleFileSelected(file) {
  // Kiểm tra định dạng cho phép
  const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  const allowedExts = ['.pdf', '.png', '.jpg', '.jpeg'];
  const ext = '.' + file.name.split('.').pop().toLowerCase();

  if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
    showToast('Định dạng file không được hỗ trợ! Chỉ nhận PDF, PNG, JPG.', 'error');
    return;
  }

  // Kiểm tra kích thước file (tối đa 10MB)
  if (file.size > 10 * 1024 * 1024) {
    showToast('File quá lớn! Vui lòng chọn file dưới 10MB.', 'error');
    return;
  }

  // Bắt đầu mô phỏng quá trình OCR/phân tích
  startDocumentAnalysis(file);
}

/**
 * Mô phỏng quá trình phân tích tài liệu (OCR Simulation).
 * Hiển thị các bước xử lý tuần tự với thời gian trễ (setTimeout).
 * Cuối cùng tạo ra dữ liệu bóc tách ngẫu nhiên để demo.
 * @param {File} file - File cần phân tích
 */
function startDocumentAnalysis(file) {
  // Ẩn dropzone, hiện processing status
  document.getElementById('dropzone').style.display = 'none';
  document.getElementById('extraction-preview').style.display = 'none';
  const processingDiv = document.getElementById('processing-status');
  const stepsContainer = document.getElementById('processing-steps');
  const processingText = document.getElementById('processing-text');

  processingDiv.style.display = 'block';
  stepsContainer.innerHTML = '';

  // Các bước mô phỏng xử lý
  const analysisSteps = [
    { text: `📂 Đọc file: ${file.name}`, delay: 400 },
    { text: '🔍 Nhận diện ngôn ngữ...', delay: 900 },
    { text: '📝 Trích xuất văn bản (OCR)...', delay: 1700 },
    { text: '🤖 Phân tích cấu trúc công thức...', delay: 2600 },
    { text: '🧪 Nhận diện nguyên liệu & định lượng...', delay: 3400 },
    { text: '✅ Hoàn tất bóc tách!', delay: 4200 }
  ];

  // Hiển thị từng bước tuần tự
  analysisSteps.forEach((step, idx) => {
    setTimeout(() => {
      processingText.textContent = step.text;

      const stepEl = document.createElement('div');
      stepEl.className = 'processing-step active';
      stepEl.innerHTML = `<span>⏳</span><span>${step.text}</span>`;
      stepsContainer.appendChild(stepEl);

      // Đánh dấu bước trước là hoàn thành
      if (idx > 0) {
        const prev = stepsContainer.children[idx - 1];
        if (prev) {
          prev.classList.remove('active');
          prev.classList.add('done');
          prev.querySelector('span:first-child').textContent = '✅';
        }
      }

      // Bước cuối cùng: hiện kết quả bóc tách
      if (idx === analysisSteps.length - 1) {
        setTimeout(() => {
          processingDiv.style.display = 'none';
          showExtractionPreview(file);
        }, 600);
      }
    }, step.delay);
  });
}

/**
 * Tạo dữ liệu bóc tách mô phỏng từ file đã upload.
 * Trong thực tế, đây sẽ là kết quả từ API OCR (Google Vision, Tesseract...).
 * Hiện tại sinh ngẫu nhiên một công thức mẫu để demo tính năng.
 * @param {File} file - File đã upload
 */
function showExtractionPreview(file) {
  // Tạo dữ liệu mô phỏng từ quá trình bóc tách
  const simulatedExtractions = [
    {
      name: 'Honey Lavender Latte',
      category: 'Coffee',
      icon: '🪻',
      ingredients: [
        { name: 'Espresso shot', amount: '60ml' },
        { name: 'Sữa hạnh nhân', amount: '150ml' },
        { name: 'Siro mật ong oải hương', amount: '20ml' },
        { name: 'Bông oải hương khô', amount: 'Trang trí' }
      ],
      steps: [
        'Pha 2 shots espresso.',
        'Đun nóng sữa hạnh nhân đến 60°C.',
        'Hòa tan siro mật ong oải hương vào sữa.',
        'Đổ espresso vào ly, thêm sữa.',
        'Trang trí bằng bông oải hương khô.'
      ]
    },
    {
      name: 'Taro Milk Tea',
      category: 'Tea',
      icon: '🟣',
      ingredients: [
        { name: 'Trà đen Assam', amount: '5g' },
        { name: 'Bột khoai môn', amount: '30g' },
        { name: 'Sữa tươi', amount: '200ml' },
        { name: 'Đường nâu', amount: '25g' },
        { name: 'Trân châu đen', amount: '50g' }
      ],
      steps: [
        'Pha trà đen đặm, để nguội.',
        'Hòa tan bột khoai môn với 50ml sữa.',
        'Nấu chín trân châu, ướp đường nâu.',
        'Cho trân châu vào đáy ly.',
        'Đổ trà, sữa và hỗn hợp khoai môn vào.',
        'Thêm đá, khuấy đều và phục vụ.'
      ]
    },
    {
      name: 'Mango Passionfruit Smoothie',
      category: 'Smoothie',
      icon: '🥭',
      ingredients: [
        { name: 'Xoài chín cắt miếng', amount: '150g' },
        { name: 'Cơm chanh dây', amount: '2 quả' },
        { name: 'Sữa dừa', amount: '100ml' },
        { name: 'Mật ong', amount: '15ml' },
        { name: 'Đá viên', amount: '80g' }
      ],
      steps: [
        'Chuẩn bị và cắt nhỏ tất cả trái cây.',
        'Cho xoài, chanh dây, sữa dừa, mật ong và đá vào máy xay.',
        'Xay ở tốc độ cao 45 giây.',
        'Đổ ra ly, trang trí với lát xoài.'
      ]
    }
  ];

  // Chọn ngẫu nhiên một mẫu để mô phỏng kết quả OCR
  const extracted = simulatedExtractions[Math.floor(Math.random() * simulatedExtractions.length)];
  extractedPreviewData = extracted;

  // Render form xem trước kết quả bóc tách
  renderExtractionPreviewForm(extracted);

  document.getElementById('extraction-preview').style.display = 'block';
}

/**
 * Render form cho phép người dùng xem và chỉnh sửa kết quả bóc tách
 * trước khi xác nhận lưu vào hệ thống.
 * @param {Object} data - Dữ liệu bóc tách
 */
function renderExtractionPreviewForm(data) {
  const form = document.getElementById('preview-form');

  // Build HTML form chỉnh sửa kết quả
  const ingRows = data.ingredients.map((ing, i) => `
    <div class="dynamic-row" id="prev-ing-${i}">
      <input type="text" class="prev-ing-name" placeholder="Tên nguyên liệu" value="${escapeHtml(ing.name)}" />
      <input type="text" class="prev-ing-amount" placeholder="Định lượng" value="${escapeHtml(ing.amount)}" />
      <button type="button" class="remove-row" onclick="removePreviewRow('prev-ing-${i}')">✕</button>
    </div>
  `).join('');

  const stepRows = data.steps.map((step, i) => `
    <div class="dynamic-row" id="prev-step-${i}">
      <input type="text" class="prev-step-input" placeholder="Bước ${i + 1}" value="${escapeHtml(step)}" />
      <button type="button" class="remove-row" onclick="removePreviewRow('prev-step-${i}')">✕</button>
    </div>
  `).join('');

  form.innerHTML = `
    <div class="form-group">
      <label>Tên Món (đã nhận diện)</label>
      <input type="text" id="prev-name" value="${escapeHtml(data.name)}" placeholder="Tên món" />
    </div>
    <div class="form-group">
      <label>Danh Mục</label>
      <select id="prev-category">
        <option value="Coffee" ${data.category === 'Coffee' ? 'selected' : ''}>☕ Coffee</option>
        <option value="Tea"    ${data.category === 'Tea' ? 'selected' : ''}>🍵 Tea</option>
        <option value="Mocktail" ${data.category === 'Mocktail' ? 'selected' : ''}>🍹 Mocktail</option>
        <option value="Smoothie" ${data.category === 'Smoothie' ? 'selected' : ''}>🥤 Smoothie</option>
      </select>
    </div>
    <div class="form-group">
      <label>Nguyên Liệu Đã Bóc Tách</label>
      <div id="prev-ingredients">${ingRows}</div>
      <button type="button" class="btn-add-item" onclick="addPreviewIngredientRow()">
        <span>+</span> Thêm nguyên liệu
      </button>
    </div>
    <div class="form-group">
      <label>Các Bước Thực Hiện</label>
      <div id="prev-steps">${stepRows}</div>
      <button type="button" class="btn-add-item" onclick="addPreviewStepRow()">
        <span>+</span> Thêm bước
      </button>
    </div>
  `;
}

/** Thêm hàng nguyên liệu trong form preview */
function addPreviewIngredientRow() {
  const container = document.getElementById('prev-ingredients');
  const idx = container.children.length;
  const rowId = `prev-ing-${idx}`;
  const div = document.createElement('div');
  div.className = 'dynamic-row';
  div.id = rowId;
  div.innerHTML = `
    <input type="text" class="prev-ing-name" placeholder="Tên nguyên liệu" />
    <input type="text" class="prev-ing-amount" placeholder="Định lượng" />
    <button type="button" class="remove-row" onclick="removePreviewRow('${rowId}')">✕</button>
  `;
  container.appendChild(div);
  div.querySelector('.prev-ing-name').focus();
}

/** Thêm hàng bước trong form preview */
function addPreviewStepRow() {
  const container = document.getElementById('prev-steps');
  const idx = container.children.length;
  const rowId = `prev-step-${idx}`;
  const div = document.createElement('div');
  div.className = 'dynamic-row';
  div.id = rowId;
  div.innerHTML = `
    <input type="text" class="prev-step-input" placeholder="Bước ${idx + 1}" />
    <button type="button" class="remove-row" onclick="removePreviewRow('${rowId}')">✕</button>
  `;
  container.appendChild(div);
  div.querySelector('.prev-step-input').focus();
}

/**
 * Xóa một hàng trong form preview.
 * @param {string} rowId
 */
function removePreviewRow(rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const parent = row.parentElement;
  if (parent.querySelectorAll('.dynamic-row').length <= 1) {
    showToast('Phải có ít nhất 1 mục!', 'warning');
    return;
  }
  row.remove();
}

/**
 * Thu thập dữ liệu từ form preview và lưu vào localStorage.
 * Đây là bước "Xác nhận & Lưu" – thực hiện cơ chế cộng dồn liên tục.
 * Dữ liệu mới được thêm vào mảng hiện có mà không ghi đè.
 */
function confirmAndSaveImport() {
  const name = document.getElementById('prev-name')?.value.trim();
  const category = document.getElementById('prev-category')?.value;

  if (!name) {
    showToast('Vui lòng nhập tên món!', 'error');
    return;
  }

  // Thu thập nguyên liệu từ form preview
  const ingRows = document.querySelectorAll('#prev-ingredients .dynamic-row');
  const ingredients = [];
  ingRows.forEach(row => {
    const ingName = row.querySelector('.prev-ing-name')?.value.trim();
    const ingAmount = row.querySelector('.prev-ing-amount')?.value.trim();
    if (ingName) ingredients.push({ name: ingName, amount: ingAmount || '' });
  });

  if (ingredients.length === 0) {
    showToast('Phải có ít nhất 1 nguyên liệu!', 'error');
    return;
  }

  // Thu thập bước thực hiện từ form preview
  const stepInputs = document.querySelectorAll('#prev-steps .prev-step-input');
  const steps = [];
  stepInputs.forEach(input => {
    const step = input.value.trim();
    if (step) steps.push(step);
  });

  // Tạo object công thức mới và lưu vào localStorage (cộng dồn, không ghi đè)
  const newRecipe = addRecipe({
    name,
    category,
    icon: getCategoryIcon(category),
    ingredients,
    steps: steps.length > 0 ? steps : ['Thực hiện theo hướng dẫn.']
  });

  // Lưu vào lịch sử import
  addImportHistory({
    id: newRecipe.id,
    fileName: extractedPreviewData?.fileName || 'file tải lên',
    name: newRecipe.name,
    time: Date.now()
  });

  // Reset giao diện về trạng thái ban đầu
  resetImportUI();
  showToast(`✅ Đã lưu "${newRecipe.name}" vào thư viện! Bạn có thể upload file tiếp theo.`, 'success', 5000);
  renderImportHistory();
}

/**
 * Reset giao diện Smart Import về trạng thái ban đầu
 * để người dùng có thể upload file tiếp theo.
 */
function resetImportUI() {
  document.getElementById('dropzone').style.display = 'block';
  document.getElementById('processing-status').style.display = 'none';
  document.getElementById('extraction-preview').style.display = 'none';
  document.getElementById('file-input').value = ''; // Reset file input
  extractedPreviewData = null;
}

/**
 * Render danh sách lịch sử import.
 */
function renderImportHistory() {
  const historyList = document.getElementById('history-list');
  const history = getImportHistory();

  if (history.length === 0) {
    historyList.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">Chưa có lịch sử import nào.</p>';
    return;
  }

  historyList.innerHTML = history.map(item => `
    <div class="history-item">
      <span class="history-icon">📄</span>
      <div class="history-info">
        <div class="history-name">${escapeHtml(item.name)}</div>
        <div class="history-time">${formatTime(item.time)}</div>
      </div>
      <span class="history-badge">✅ Đã lưu</span>
    </div>
  `).join('');
}

/* =============================================================
   PHẦN 9: GAME 1 – SELECT & MIX (Chọn Nguyên Liệu)
   ============================================================= */

// Trạng thái game 1
let game1State = {
  currentRecipe: null,  // Công thức đang được đố
  selectedIds: [],    // Mảng id của các nguyên liệu đã chọn
  allCards: [],    // Tất cả thẻ nguyên liệu (đúng + bẫy)
  hintsUsed: 0,     // Số lần đã dùng gợi ý
  maxHints: 2,     // Tối đa 2 lần gợi ý
  isSubmitted: false, // Đã nộp bài chưa
  scope: 'all'  // Phạm vi nhóm đồ uống: 'all', 'Coffee', 'Tea'
};

/**
 * Bắt đầu một lượt chơi game 1.
 * Chọn ngẫu nhiên 1 công thức theo scope (hoặc đích danh targetRecipeId), tạo lưới nguyên liệu (đúng + bẫy).
 * @param {string|null} targetRecipeId - ID món cụ thể muốn luyện tập
 */
function startGame1(targetRecipeId = null) {
  const recipes = getRecipes();
  if (recipes.length === 0) {
    showToast('Chưa có công thức nào! Hãy thêm công thức trước.', 'warning');
    return;
  }

  // Lọc theo scope đã chọn (Cà phê hoặc Trà) nếu không chỉ định cụ thể món
  let candidatePool = recipes;
  if (!targetRecipeId && game1State.scope && game1State.scope !== 'all') {
    candidatePool = recipes.filter(r => r.category === game1State.scope);
    if (candidatePool.length === 0) candidatePool = recipes;
  }

  // Reset trạng thái
  game1State.hintsUsed = 0;
  game1State.selectedIds = [];
  game1State.isSubmitted = false;

  // Chọn công thức làm đề bài
  if (targetRecipeId) {
    game1State.currentRecipe = recipes.find(r => r.id === targetRecipeId) || candidatePool[0];
  } else {
    game1State.currentRecipe = candidatePool[Math.floor(Math.random() * candidatePool.length)];
  }
  const recipe = game1State.currentRecipe;

  // Hiển thị tên món yêu cầu
  document.getElementById('game1-challenge-name').textContent = recipe.name;
  document.getElementById('game1-challenge-category').textContent =
    `${getCategoryIcon(recipe.category)} ${recipe.category}`;

  // Tạo danh sách nguyên liệu "bẫy" từ các công thức khác
  const correctIngredients = recipe.ingredients.map((ing, idx) => ({
    id: `correct-${idx}`,
    name: ing.name,
    amount: ing.amount,
    isCorrect: true
  }));

  // Lấy nguyên liệu từ các công thức khác làm bẫy
  const otherRecipes = recipes.filter(r => r.id !== recipe.id);
  const trapPool = otherRecipes.flatMap(r => r.ingredients)
    .filter(ing => !correctIngredients.some(c => normalizeStr(c.name) === normalizeStr(ing.name)));

  // Số nguyên liệu bẫy: 3 đến 5, tối thiểu bằng pool có sẵn
  const trapCount = Math.min(Math.floor(Math.random() * 3) + 3, trapPool.length);
  const trapIngredients = pickRandom(trapPool, trapCount).map((ing, idx) => ({
    id: `trap-${idx}`,
    name: ing.name,
    amount: ing.amount,
    isCorrect: false
  }));

  // Trộn ngẫu nhiên tất cả thẻ
  game1State.allCards = shuffleArray([...correctIngredients, ...trapIngredients]);

  // Render lưới nguyên liệu
  renderGame1Grid();

  // Cập nhật UI gợi ý
  updateGame1HintUI();

  // Xóa nội dung gợi ý cũ
  const hintDisplay = document.getElementById('game1-hint-display');
  hintDisplay.textContent = '';
  hintDisplay.classList.remove('visible');

  // Xóa selected tray
  updateGame1SelectedTray();

  // Chuyển về màn hình chơi
  document.getElementById('game1-start').style.display = 'none';
  document.getElementById('game1-result').style.display = 'none';
  document.getElementById('game1-play').style.display = 'flex';
  document.getElementById('game1-play').style.flexDirection = 'column';
}

/**
 * Render lưới các thẻ nguyên liệu trong game 1.
 * Mỗi thẻ có thể click để chọn/bỏ chọn.
 */
function renderGame1Grid() {
  const grid = document.getElementById('game1-ingredients-grid');
  const icons = ['🧂', '🥛', '☕', '🫖', '🍬', '🍋', '🌿', '🫙', '🥤', '💧', '🫐', '🍓', '🍑', '🥥', '🍯', '🌰'];

  grid.innerHTML = game1State.allCards.map(card => {
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    return `
      <div class="ingredient-card" data-card-id="${card.id}" role="checkbox" aria-checked="false" tabindex="0">
        <span class="ingredient-card-icon">${randomIcon}</span>
        <span class="ingredient-card-name">${escapeHtml(card.name)}</span>
        <span class="ingredient-card-amount">${escapeHtml(card.amount)}</span>
      </div>
    `;
  }).join('');

  // Gắn sự kiện click cho từng thẻ
  grid.querySelectorAll('.ingredient-card').forEach(card => {
    card.addEventListener('click', () => toggleGame1Card(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleGame1Card(card);
      }
    });
  });
}

/**
 * Toggle trạng thái chọn/bỏ chọn của một thẻ nguyên liệu.
 * Cập nhật mảng selectedIds và UI tray đã chọn.
 * @param {HTMLElement} cardEl - Phần tử thẻ nguyên liệu
 */
function toggleGame1Card(cardEl) {
  if (game1State.isSubmitted) return; // Không cho thay đổi sau khi nộp bài

  const cardId = cardEl.dataset.cardId;
  const idx = game1State.selectedIds.indexOf(cardId);

  if (idx > -1) {
    // Bỏ chọn
    game1State.selectedIds.splice(idx, 1);
    cardEl.classList.remove('selected');
    cardEl.setAttribute('aria-checked', 'false');
  } else {
    // Chọn
    game1State.selectedIds.push(cardId);
    cardEl.classList.add('selected');
    cardEl.setAttribute('aria-checked', 'true');
  }

  updateGame1SelectedTray();
}

/**
 * Cập nhật khu vực hiển thị nguyên liệu đã chọn ("Ly pha chế").
 */
function updateGame1SelectedTray() {
  const tray = document.getElementById('game1-selected-list');
  if (game1State.selectedIds.length === 0) {
    tray.innerHTML = '<span class="selected-empty">Chưa chọn nguyên liệu nào...</span>';
    return;
  }

  const selectedCards = game1State.allCards.filter(c => game1State.selectedIds.includes(c.id));
  tray.innerHTML = selectedCards
    .map(c => `<span class="selected-tag">${escapeHtml(c.name)}</span>`)
    .join('');
}

/**
 * Xử lý gợi ý trong game 1.
 * Lần 1: Hiển thị nhóm nguyên liệu chính (chỉ tên).
 * Lần 2: Hiển thị chi tiết định lượng chuẩn.
 */
function useGame1Hint() {
  if (game1State.hintsUsed >= game1State.maxHints) return;

  game1State.hintsUsed++;
  const recipe = game1State.currentRecipe;
  const hintDisplay = document.getElementById('game1-hint-display');

  if (game1State.hintsUsed === 1) {
    // Gợi ý lần 1: Chỉ tên các nguyên liệu chính
    const ingNames = recipe.ingredients.map(i => i.name).join(', ');
    hintDisplay.textContent = `💡 Gợi ý: Món này cần ${ingNames}.`;
  } else if (game1State.hintsUsed === 2) {
    // Gợi ý lần 2: Đầy đủ tên + định lượng
    const ingFull = recipe.ingredients.map(i => `${i.name} (${i.amount})`).join(' • ');
    hintDisplay.textContent = `💡 Định lượng: ${ingFull}.`;
  }

  hintDisplay.classList.add('visible');
  updateGame1HintUI();
}

/** Cập nhật trạng thái nút gợi ý game 1 */
function updateGame1HintUI() {
  const remaining = game1State.maxHints - game1State.hintsUsed;
  const hintBtn = document.getElementById('game1-hint-btn');
  const hintCount = document.getElementById('game1-hint-count');
  hintCount.textContent = `(${remaining} lần còn lại)`;
  if (remaining <= 0) hintBtn.disabled = true;
}

/**
 * Kiểm tra kết quả khi người chơi bấm "Pha Chế Ngay".
 * So sánh mảng nguyên liệu đã chọn với mảng nguyên liệu đúng của đề bài.
 * Tính điểm, hiển thị phản hồi chi tiết.
 */
function submitGame1() {
  if (game1State.isSubmitted) return;
  game1State.isSubmitted = true;

  const recipe = game1State.currentRecipe;
  const correctCards = game1State.allCards.filter(c => c.isCorrect);
  const selectedCards = game1State.allCards.filter(c => game1State.selectedIds.includes(c.id));

  // Xác định nguyên liệu đúng/sai/thiếu/thừa
  const correctSelected = selectedCards.filter(c => c.isCorrect);   // Đúng & có chọn
  const wrongSelected = selectedCards.filter(c => !c.isCorrect);  // Sai (bẫy đã chọn)
  const missingIngredients = correctCards.filter(c => !game1State.selectedIds.includes(c.id)); // Thiếu

  const isPerfect = correctSelected.length === correctCards.length && wrongSelected.length === 0;
  const isPartial = correctSelected.length > 0 && !isPerfect;

  // Tính điểm và cập nhật chuỗi thắng
  let pointsEarned = 0;
  let streak = getStreak();

  if (isPerfect) {
    // Chọn đúng 100%: cộng 10 điểm + bonus chuỗi
    streak++;
    setStreak(streak);
    const bonus = Math.min(streak - 1, 5); // Bonus tối đa +5 điểm
    pointsEarned = 10 + bonus;
    addScore(pointsEarned);
    launchConfetti(); // Hiệu ứng chúc mừng
  } else if (isPartial) {
    // Đúng một phần: cộng điểm theo tỉ lệ
    streak = 0;
    setStreak(0);
    pointsEarned = Math.floor((correctSelected.length / correctCards.length) * 5);
    if (wrongSelected.length > 0) pointsEarned = Math.max(0, pointsEarned - wrongSelected.length);
    addScore(pointsEarned);
  } else {
    // Sai hoàn toàn: trừ 3 điểm
    streak = 0;
    setStreak(0);
    pointsEarned = -3;
    addScore(-3);
  }

  updateScoreDisplay();

  // Hiển thị phản hồi trực quan trên các thẻ
  game1State.allCards.forEach(card => {
    const cardEl = document.querySelector(`[data-card-id="${card.id}"]`);
    if (!cardEl) return;

    const isSelected = game1State.selectedIds.includes(card.id);
    if (card.isCorrect && isSelected) {
      cardEl.classList.add('correct'); // Đúng & đã chọn: xanh lá
    } else if (!card.isCorrect && isSelected) {
      cardEl.classList.add('wrong');   // Bẫy mà chọn: đỏ
    } else if (card.isCorrect && !isSelected) {
      cardEl.classList.add('wrong');   // Đúng nhưng bỏ sót: đánh dấu đỏ
    }
    cardEl.classList.remove('selected');
  });

  // Tạo nội dung phản hồi chi tiết
  const feedbackItems = [
    ...correctSelected.map(c => `<div class="feedback-item ok">✅ ${c.name} – Chính xác!</div>`),
    ...wrongSelected.map(c => `<div class="feedback-item extra">❌ Thừa: ${c.name} – Không thuộc công thức này</div>`),
    ...missingIngredients.map(c => `<div class="feedback-item miss">⚠️ Thiếu: ${c.name} (${c.amount})</div>`)
  ].join('');

  // Chuyển sang màn hình kết quả sau 1.5 giây
  setTimeout(() => {
    const resultEl = document.getElementById('game1-result');
    const content = document.getElementById('game1-result-content');

    if (isPerfect) {
      content.innerHTML = `
        <div class="result-icon">🎉</div>
        <h2 class="result-title success">Pha Chế Thành Công!</h2>
        <p class="result-subtitle">Bạn đã chọn chính xác tất cả nguyên liệu cho <strong>${recipe.name}</strong>!</p>
        ${streak > 1 ? `<div class="result-subtitle" style="color:var(--warning)">🔥 Chuỗi thắng: ${streak}!</div>` : ''}
        <div class="result-points">+${pointsEarned} điểm</div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="showRecipeDetailFromGame('${recipe.id}')">📖 Xem Công Thức</button>
          <button class="btn-game-start" onclick="startGame1()">🔄 Thử Món Khác</button>
        </div>
      `;
    } else {
      content.innerHTML = `
        <div class="result-icon">${isPartial ? '😅' : '💀'}</div>
        <h2 class="result-title ${isPartial ? 'partial' : 'failure'}">${isPartial ? 'Pha Chưa Đạt!' : 'Pha Hỏng Rồi!'}</h2>
        <p class="result-subtitle">${isPartial ? 'Bạn đúng một phần. Hãy xem lại chi tiết công thức.' : 'Công thức chưa đúng. Đừng nản, thử lại nào!'}</p>
        <div class="result-feedback">
          <h4>Chi tiết kết quả:</h4>
          ${feedbackItems}
        </div>
        ${pointsEarned !== 0 ? `<div class="result-points" style="color: ${pointsEarned > 0 ? 'var(--warning)' : 'var(--error)'}">
          ${pointsEarned > 0 ? '+' : ''}${pointsEarned} điểm
        </div>` : ''}
        <div class="result-actions">
          <button class="btn-secondary" onclick="showRecipeDetailFromGame('${recipe.id}')">📖 Xem Đáp Án</button>
          <button class="btn-game-start" onclick="startGame1()">🔄 Thử Lại</button>
        </div>
      `;
    }

    document.getElementById('game1-play').style.display = 'none';
    resultEl.style.display = 'block';
  }, isPerfect ? 1500 : 800);
}

/**
 * Mở modal chi tiết công thức từ màn hình kết quả game.
 * @param {string} recipeId
 */
function showRecipeDetailFromGame(recipeId) {
  const recipe = getRecipes().find(r => r.id === recipeId);
  if (recipe) openDetailModal(recipe);
}

/* =============================================================
   PHẦN 10: GAME 2 – RECALL & TYPE (Tự Gõ Công Thức)
   ============================================================= */

// Trạng thái game 2
let game2State = {
  currentRecipe: null, // Công thức đang được đố
  hintsUsed: 0,    // Số lần đã dùng gợi ý
  maxHints: 2,    // Tối đa 2 lần gợi ý
  isSubmitted: false,// Đã nộp bài chưa
  scope: 'all' // Phạm vi nhóm đồ uống: 'all', 'Coffee', 'Tea'
};

/**
 * Bắt đầu một lượt chơi game 2.
 * Chọn ngẫu nhiên 1 công thức theo scope (hoặc đích danh targetRecipeId), hiển thị form điền nguyên liệu rỗng.
 * @param {string|null} targetRecipeId - ID món cụ thể muốn thử thách
 */
function startGame2(targetRecipeId = null) {
  const recipes = getRecipes();
  if (recipes.length === 0) {
    showToast('Chưa có công thức nào! Hãy thêm công thức trước.', 'warning');
    return;
  }

  // Lọc theo scope đã chọn (Cà phê hoặc Trà)
  let candidatePool = recipes;
  if (!targetRecipeId && game2State.scope && game2State.scope !== 'all') {
    candidatePool = recipes.filter(r => r.category === game2State.scope);
    if (candidatePool.length === 0) candidatePool = recipes;
  }

  // Reset trạng thái
  game2State.hintsUsed = 0;
  game2State.isSubmitted = false;

  // Chọn công thức
  if (targetRecipeId) {
    game2State.currentRecipe = recipes.find(r => r.id === targetRecipeId) || candidatePool[0];
  } else {
    game2State.currentRecipe = candidatePool[Math.floor(Math.random() * candidatePool.length)];
  }
  const recipe = game2State.currentRecipe;

  // Hiển thị tên món
  document.getElementById('game2-challenge-name').textContent = recipe.name;
  document.getElementById('game2-challenge-category').textContent =
    `${getCategoryIcon(recipe.category)} ${recipe.category}`;

  // Render form điền nguyên liệu rỗng (số hàng bằng số nguyên liệu của công thức)
  renderGame2InputRows(recipe.ingredients.length);

  // Cập nhật UI gợi ý
  updateGame2HintUI();

  // Xóa gợi ý cũ
  const hintDisplay = document.getElementById('game2-hint-display');
  hintDisplay.textContent = '';
  hintDisplay.classList.remove('visible');

  // Chuyển sang màn hình chơi
  document.getElementById('game2-start').style.display = 'none';
  document.getElementById('game2-result').style.display = 'none';
  document.getElementById('game2-play').style.display = 'flex';
  document.getElementById('game2-play').style.flexDirection = 'column';

  // Focus vào ô nhập đầu tiên
  setTimeout(() => {
    document.querySelector('#game2-recall-inputs .recall-name')?.focus();
  }, 100);
}

/**
 * Render các hàng input trong game 2 để người chơi điền nguyên liệu.
 * @param {number} count - Số hàng ban đầu (bằng số nguyên liệu của đề bài)
 */
function renderGame2InputRows(count) {
  const container = document.getElementById('game2-recall-inputs');
  container.innerHTML = '';
  for (let i = 0; i < count; i++) {
    addGame2Row(container, i + 1);
  }
}

/**
 * Thêm một hàng input mới vào form game 2.
 * @param {HTMLElement} container - Container chứa các hàng
 * @param {number} rowNum - Số thứ tự hàng (để hiển thị placeholder)
 */
function addGame2Row(container, rowNum) {
  const rowId = `g2-row-${uid()}`;
  const div = document.createElement('div');
  div.className = 'recall-row';
  div.id = rowId;
  div.innerHTML = `
    <input type="text" class="recall-name" placeholder="Nguyên liệu ${rowNum}" />
    <input type="text" class="recall-amount" placeholder="Định lượng" />
    <button type="button" class="remove-row" onclick="removeGame2Row('${rowId}')">✕</button>
  `;
  container.appendChild(div);
}

/**
 * Xóa một hàng input trong game 2.
 * @param {string} rowId
 */
function removeGame2Row(rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;
  const parent = row.parentElement;
  if (parent.querySelectorAll('.recall-row').length <= 1) {
    showToast('Phải có ít nhất 1 hàng!', 'warning');
    return;
  }
  row.remove();
}

/**
 * Thêm một hàng input mới khi người chơi bấm "+ Thêm Thành Phần".
 */
function addGame2InputRow() {
  const container = document.getElementById('game2-recall-inputs');
  const rowNum = container.querySelectorAll('.recall-row').length + 1;
  addGame2Row(container, rowNum);
  container.lastElementChild?.querySelector('.recall-name')?.focus();
}

/**
 * Xử lý gợi ý trong game 2.
 * Cơ chế tương tự game 1 nhưng dành cho chế độ gõ tay.
 */
function useGame2Hint() {
  if (game2State.hintsUsed >= game2State.maxHints) return;

  game2State.hintsUsed++;
  const recipe = game2State.currentRecipe;
  const hintDisplay = document.getElementById('game2-hint-display');

  if (game2State.hintsUsed === 1) {
    // Gợi ý lần 1: Tên các nguyên liệu chính (không có định lượng)
    const ingNames = recipe.ingredients.map(i => i.name).join(', ');
    hintDisplay.textContent = `💡 Gợi ý: Cần có ${ingNames}.`;
  } else if (game2State.hintsUsed === 2) {
    // Gợi ý lần 2: Đầy đủ tên + định lượng
    const ingFull = recipe.ingredients.map(i => `${i.name} → ${i.amount}`).join(' | ');
    hintDisplay.textContent = `💡 Định lượng đầy đủ: ${ingFull}`;
  }

  hintDisplay.classList.add('visible');
  updateGame2HintUI();
}

/** Cập nhật trạng thái nút gợi ý game 2 */
function updateGame2HintUI() {
  const remaining = game2State.maxHints - game2State.hintsUsed;
  const hintBtn = document.getElementById('game2-hint-btn');
  const hintCount = document.getElementById('game2-hint-count');
  hintCount.textContent = `(${remaining} lần còn lại)`;
  if (remaining <= 0) hintBtn.disabled = true;
  else hintBtn.disabled = false;
}

/**
 * Kiểm tra kết quả game 2 khi người chơi bấm "Kiểm Tra Công Thức".
 * Thuật toán so khớp mảng nguyên liệu:
 * - Chuẩn hóa tên nguyên liệu và định lượng người dùng nhập.
 * - So sánh với mảng nguyên liệu gốc trong localStorage.
 * - Dùng fuzzyMatch() để cho phép sai lệch nhỏ về chính tả/dấu tiếng Việt.
 */
function submitGame2() {
  if (game2State.isSubmitted) return;
  game2State.isSubmitted = true;

  const recipe = game2State.currentRecipe;

  // Thu thập tất cả hàng người chơi đã điền
  const rows = document.querySelectorAll('#game2-recall-inputs .recall-row');
  const userIngredients = [];
  rows.forEach(row => {
    const name = row.querySelector('.recall-name')?.value.trim() || '';
    const amount = row.querySelector('.recall-amount')?.value.trim() || '';
    if (name) userIngredients.push({ name, amount });
  });

  if (userIngredients.length === 0) {
    game2State.isSubmitted = false;
    showToast('Vui lòng điền ít nhất 1 nguyên liệu!', 'warning');
    return;
  }

  const correctIngredients = recipe.ingredients;

  /**
   * So khớp từng nguyên liệu người dùng nhập với dữ liệu gốc.
   * Một nguyên liệu được tính là đúng khi:
   *   - Tên khớp (fuzzyMatch) VÀ
   *   - Định lượng khớp (fuzzyMatch) HOẶC người dùng để trống định lượng
   */
  const matchResults = correctIngredients.map(correct => {
    // Tìm xem người dùng có điền nguyên liệu này không
    const matched = userIngredients.find(u =>
      fuzzyMatch(u.name, correct.name)
    );

    if (!matched) {
      return { correct, matched: null, status: 'missing' };
    }

    // Kiểm tra định lượng (nếu người dùng có điền)
    const amountOk = !matched.amount || fuzzyMatch(matched.amount, correct.amount);
    return {
      correct,
      matched,
      status: amountOk ? 'correct' : 'wrong_amount'
    };
  });

  // Nguyên liệu người dùng điền nhưng không có trong công thức gốc
  const extraIngredients = userIngredients.filter(u =>
    !correctIngredients.some(c => fuzzyMatch(u.name, c.name))
  );

  const correctCount = matchResults.filter(r => r.status === 'correct').length;
  const totalRequired = correctIngredients.length;
  const accuracy = correctCount / totalRequired; // Tỉ lệ đúng (0.0 → 1.0)

  const isPerfect = accuracy === 1 && extraIngredients.length === 0;
  const isGood = accuracy >= 0.7 && !isPerfect;
  const isBad = accuracy < 0.7;

  // Đánh dấu màu trên các ô input
  rows.forEach(row => {
    const nameInput = row.querySelector('.recall-name');
    const amountInput = row.querySelector('.recall-amount');
    const name = nameInput?.value.trim();
    if (!name) return;

    const isMatched = correctIngredients.some(c => fuzzyMatch(name, c.name));
    if (isMatched) {
      const result = matchResults.find(r => r.matched && fuzzyMatch(r.matched.name, name));
      if (result?.status === 'correct') {
        nameInput?.classList.add('correct-input');
        amountInput?.classList.add('correct-input');
      } else {
        amountInput?.classList.add('wrong-input');
        nameInput?.classList.add('correct-input');
      }
    } else {
      nameInput?.classList.add('wrong-input');
      amountInput?.classList.add('wrong-input');
    }
  });

  // Tính điểm: 0-20 điểm dựa theo độ chính xác
  let pointsEarned = 0;
  let streak = getStreak();

  if (isPerfect) {
    streak++;
    setStreak(streak);
    const bonus = Math.min(streak - 1, 5);
    pointsEarned = 20 + bonus;
    launchConfetti();
  } else if (isGood) {
    streak = 0; setStreak(0);
    pointsEarned = Math.floor(accuracy * 15);
  } else {
    streak = 0; setStreak(0);
    pointsEarned = Math.floor(accuracy * 5);
  }

  addScore(pointsEarned);
  updateScoreDisplay();

  // Build HTML phản hồi chi tiết
  const feedbackHTML = [
    ...matchResults.map(r => {
      if (r.status === 'correct') {
        return `<div class="feedback-item ok">✅ ${r.correct.name} (${r.correct.amount}) – Chính xác!</div>`;
      } else if (r.status === 'wrong_amount') {
        return `<div class="feedback-item extra">⚠️ ${r.correct.name}: định lượng sai (đúng: ${r.correct.amount})</div>`;
      } else {
        return `<div class="feedback-item miss">❌ Thiếu: ${r.correct.name} (${r.correct.amount})</div>`;
      }
    }),
    ...extraIngredients.map(u =>
      `<div class="feedback-item extra">🔴 Thừa: ${u.name} – Không có trong công thức</div>`
    )
  ].join('');

  // Chuyển sang màn hình kết quả
  setTimeout(() => {
    const resultEl = document.getElementById('game2-result');
    const content = document.getElementById('game2-result-content');

    if (isPerfect) {
      content.innerHTML = `
        <div class="result-icon">🏆</div>
        <h2 class="result-title success">Pha Chế Thành Công!</h2>
        <p class="result-subtitle">Xuất sắc! Bạn nhớ chính xác hoàn toàn công thức <strong>${recipe.name}</strong>!</p>
        ${streak > 1 ? `<p class="result-subtitle" style="color:var(--warning)">🔥 Chuỗi: ${streak} lần liên tiếp!</p>` : ''}
        <div class="result-points">+${pointsEarned} điểm</div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="showRecipeDetailFromGame('${recipe.id}')">📖 Xem Công Thức</button>
          <button class="btn-game-start" onclick="startGame2()">🔄 Thử Món Khác</button>
        </div>
      `;
    } else {
      content.innerHTML = `
        <div class="result-icon">${isGood ? '😅' : '😞'}</div>
        <h2 class="result-title ${isGood ? 'partial' : 'failure'}">
          ${isGood ? `Gần Đúng! (${Math.round(accuracy * 100)}%)` : 'Chưa Đạt Yêu Cầu!'}
        </h2>
        <p class="result-subtitle">
          ${isGood
          ? 'Bạn nhớ được phần lớn công thức. Hãy xem lại phần bỏ sót!'
          : 'Pha hỏng! Tỉ lệ hoặc nguyên liệu chưa khớp, hãy kiểm tra lại!'
        }
        </p>
        <div class="result-feedback">
          <h4>Chi tiết đánh giá:</h4>
          ${feedbackHTML}
        </div>
        <div class="result-points" style="color: ${pointsEarned > 0 ? 'var(--warning)' : 'var(--error)'}">
          ${pointsEarned > 0 ? '+' : ''}${pointsEarned} điểm
        </div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="showRecipeDetailFromGame('${recipe.id}')">📖 Xem Đáp Án</button>
          <button class="btn-game-start" onclick="startGame2()">🔄 Thử Lại</button>
        </div>
      `;
    }

    document.getElementById('game2-play').style.display = 'none';
    resultEl.style.display = 'block';
  }, 800);
}

/* =============================================================
   PHẦN 11: KHỞI TẠO ỨNG DỤNG – DOMContentLoaded
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // === Khởi tạo & Tự động đồng bộ dữ liệu phiên bản mới ===
  autoSyncRecipes(); // Đồng bộ công thức mẫu v3 vào localStorage

  // === Hiệu ứng loading ===
  setTimeout(() => toggleLoadingOverlay(false), 1200);

  // === Render Dashboard ===
  renderRecipeLibrary();

  // Gắn event listener toàn cục cho lưới công thức
  attachRecipeCardEventsGlobal();

  // === Điều hướng Tab ===
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });

  // === Bộ Đếm Thời Gian Ủ Trà ===
  document.getElementById('brewing-save-btn').addEventListener('click', saveBrewingRecipeFromForm);
  document.getElementById('brewing-cancel-edit-btn').addEventListener('click', resetBrewingRecipeForm);
  document.getElementById('brewing-start-btn').addEventListener('click', startBrewingTimer);
  document.getElementById('brewing-pause-btn').addEventListener('click', pauseBrewingTimer);
  document.getElementById('brewing-reset-btn').addEventListener('click', resetBrewingTimer);
  renderBrewingRecipes();
  updateBrewingTimerDisplay();

  // === Mobile Sidebar ===
  document.getElementById('hamburger-btn').addEventListener('click', openMobileSidebar);
  document.getElementById('sidebar-toggle-close').addEventListener('click', closeMobileSidebar);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileSidebar);

  // === Nút Cập Nhật / Khôi Phục Menu Chuẩn ===
  const syncBtn = document.getElementById('sync-recipes-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      if (confirm('Bạn có muốn đồng bộ lại toàn bộ công thức gốc Cà Phê & Trà chuẩn không?\n(Các công thức bạn tự tạo thêm vẫn được bảo toàn)')) {
        resetToDefaultMenu();
      }
    });
  }

  // === Modal Thêm/Sửa Công Thức ===
  document.getElementById('add-recipe-btn').addEventListener('click', () => openRecipeModal());
  document.getElementById('modal-close-btn').addEventListener('click', closeRecipeModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeRecipeModal);
  document.getElementById('modal-save-btn').addEventListener('click', saveRecipeFromModal);
  document.getElementById('add-ingredient-btn').addEventListener('click', addIngredientRow);
  document.getElementById('add-step-btn').addEventListener('click', addStepRow);

  // Đóng modal khi click ra ngoài
  document.getElementById('recipe-modal').addEventListener('click', (e) => {
    if (e.target.id === 'recipe-modal') closeRecipeModal();
  });

  // === Modal Chi Tiết ===
  document.getElementById('detail-modal-close').addEventListener('click', closeDetailModal);
  document.getElementById('detail-modal').addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal') closeDetailModal();
  });

  // Phím ESC đóng modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRecipeModal();
      closeDetailModal();
    }
  });

  // === Bộ Lọc Danh Mục ===
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.category;
      renderRecipeLibrary();
    });
  });

  // === Tìm Kiếm ===
  const searchInput = document.getElementById('search-input');
  let searchDebounce;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      currentSearchTerm = e.target.value;
      renderRecipeLibrary();
    }, 250);
  });

  // === Smart Import ===
  initDropzone();

  document.getElementById('confirm-import-btn').addEventListener('click', confirmAndSaveImport);
  document.getElementById('cancel-import-btn').addEventListener('click', resetImportUI);

  // === Scope Selector Game 1 ===
  document.querySelectorAll('#game1-scope-pills .scope-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#game1-scope-pills .scope-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      game1State.scope = btn.dataset.scope || 'all';
    });
  });

  // === Scope Selector Game 2 ===
  document.querySelectorAll('#game2-scope-pills .scope-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#game2-scope-pills .scope-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      game2State.scope = btn.dataset.scope || 'all';
    });
  });

  // === Game 1 ===
  document.getElementById('game1-start-btn').addEventListener('click', () => startGame1());
  document.getElementById('game1-hint-btn').addEventListener('click', useGame1Hint);
  document.getElementById('game1-submit-btn').addEventListener('click', submitGame1);
  document.getElementById('game1-skip-btn').addEventListener('click', () => {
    if (confirm('Bỏ qua lượt này? (-2 điểm)')) {
      addScore(-2);
      updateScoreDisplay();
      startGame1();
    }
  });

  // === Game 2 ===
  document.getElementById('game2-start-btn').addEventListener('click', () => startGame2());
  document.getElementById('game2-hint-btn').addEventListener('click', useGame2Hint);
  document.getElementById('game2-submit-btn').addEventListener('click', submitGame2);
  document.getElementById('game2-add-row-btn').addEventListener('click', addGame2InputRow);
  document.getElementById('game2-skip-btn').addEventListener('click', () => {
    if (confirm('Bỏ qua lượt này? (-2 điểm)')) {
      addScore(-2);
      updateScoreDisplay();
      startGame2();
    }
  });

  // === Khởi tạo hiển thị điểm ===
  updateScoreDisplay();

  // === Render lịch sử Import (nếu đang ở tab import) ===
  renderImportHistory();

  console.log('☕ Barista Recipe Trainer – Khởi động thành công!');
  console.log(`📚 Đã tải ${getRecipes().length} công thức từ cơ sở dữ liệu.`);
});

/* =============================================================
   PHẦN 12: SERVICE WORKER REGISTRATION (Optional – PWA Ready)
   Bật tính năng này nếu muốn app hoạt động offline.
   ============================================================= */
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/sw.js')
//     .then(reg => console.log('SW registered:', reg.scope))
//     .catch(err => console.log('SW error:', err));
// }
