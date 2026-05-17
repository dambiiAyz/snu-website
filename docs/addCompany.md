# Компани (Company) — Phase 1: Ерөнхий техникийн spec

Энэхүү баримт бичиг нь **SNU backend** (`MongoDB` + `Express` + `Mongoose`) дээр **олон компанийн** бүтцийг нэмэх ажлын **эхний үе шат** — зөвхөн шаардлага, өгөгдлийн загвар, эрхийн загвар, API-ийн ерөнхий төлөвлөгөөг тодорхойлно. Код бичихгүй.

---

## 1. Бизнес зорилго (хэрэглэгчийн шаардлага)

| № | Шаардлага |
|---|-----------|
| 1 | Системд **Company** хэсэг/ойлголт орно — компани бүр өөрийн бүртгэл, тохиргоотой. |
| 2 | **Super Admin** бүх компанийн **бүртгэл / удирдлагын** хэсгүүдэд хандаж, үүсгэх, засах, идэвхжүүлэх/цуцлах зэргээр **бүхэлд нь** удирдана. |
| 3 | **Компани** өөрсдийн **барааны бүртгэл** (нэмэх, засах, үлдэгдэл гэх мэт) — **зөвхөн өөрийн компанийн** бараанд хамаатай. |

---

## 2. Одоогийн кодтой уялдаа (шалгалтын дүгнэлт)

**Боломжтой.** Шалтгаан:

- `model/Admin.js` дотор **`Super Admin`** эрх аль хэдийн `enum`-д байна.
- `middleware/requireStaff.js` нь `Admin`, `Super Admin`, `Manager`, `CEO`-г нэг **staff** түвшинд оруулж байна — **Super Admin-only** үйлдлийг ялгах `middleware` нэмэх шаардлагатай (одоогоор бүх staff ижил түвшинд бараа API-д хандах боломжтой гэж үзэж болно).
- `model/Products.js` дээр **`companyId` эсвэл `vendorId` гэх мэт холбоос байхгүй** — бараа бүгд "нэг эзэмшилтэй" гэсэн үг. Шинэ талбар эсвэл шинэ collection-оор **tenant** тодорхойлох шаардлагатай.
- `routes/product.routes.js` дээр ихэнх endpoint-д **token шалгалт байхгүй** байж магадгүй (одоогийн байдлаар public). Компани өөрийн барааг зөвхөн өөрөө удирдах бол **auth + scope** заавал нэмэгдэнэ.

**Анхаарах зүйлс (Phase 2+):**

- Одоо байгаа бараануудыг шинэ `Company`-д хэрхэн хамааруулах вэ (**migration**: нэг "SNU Platform" компани эсвэл `companyId: null` = legacy гэх мэт).
- Захиалга (`Order`), referral (`profitSharing`), wallet логик компаниар **хуваагдах эсэх** — Phase 1-д зөвхөн тодорхойлж, шийдвэрийг spec-д үлдээнэ.

---

## 3. Тэрминологи

| Нэр | Тайлбар |
|-----|---------|
| **Company** | Бараа борлуулдаг этгээд (tenant). |
| **Super Admin** | `Admin` collection, `role === "Super Admin"` — бүх компани. |
| **Company operator** | Тухайн компанийн барааг удирдах эрхтэй хэрэглэгч (Phase 1-д: `Admin` дээр шинэ role эсвэл тусад `CompanyUser` collection — доор сонголт). |

---

## 4. Өгөгдлийн загвар (MongoDB) — санал

### 4.1. `companies` collection (шинэ)

| Талбар | Төрөл | Заавал | Тайлбар |
|--------|--------|--------|---------|
| `name` | String | тийм | Дэлгэцэнд харагдах нэр. |
| `slug` | String | тийм | URL-д ашиглах, **unique**. |
| `legalName` | String | үгүй | Албан ёсны нэр. |
| `email` | String | тийм | Холбоо барих / нэвтрэлтэд ашиглах эсэхийг Phase 2-д тодорхойлох. |
| `phone` | String | үгүй | |
| `status` | Enum | тийм | `pending`, `active`, `suspended` гэх мэт — Super Admin идэвхжүүлнэ. |
| `logoUrl` | String | үгүй | |
| `address` | Object / String | үгүй | |
| `createdBy` | ObjectId ref `Admin` | үгүй | Super Admin үүсгэсэн. |
| `timestamps` | | | `createdAt`, `updatedAt`. |

### 4.2. `products` collection өөрчлөлт

| Талбар | Төрөл | Тайлбар |
|--------|--------|---------|
| `companyId` | ObjectId ref `Company`, **required** (шинэ бараанд) | Аль компанийн бараа вэ. Legacy бараанд migration хүртэл `required: false` байж болно. |

Индекс: `{ companyId: 1, slug: 1 }` unique (slug нь компани дотор unique байх).

### 4.3. Company operator-ийг хэрхэн тодорхойлох (сонголтууд)

| Сонголт | Давуу тал | Сул тал |
|---------|-----------|---------|
| **A.** `Admin` schema-д `companyId` (зөвхөн тодорхой role-д) | Нэг нэвтрэлтийн урсгал (`loginAdmin`, JWT). | Super Admin биш хүнд `companyId` заавал шалгах. |
| **B.** Тусад `CompanyUser` + тусад login | Тодорхой салгах. | Хоёр төрлийн token, UI хоёр. |

**Phase 1 санал:** **A** — хурдан, одоогийн `generateToken` дээр `companyId` (хоосон Super Admin-д) нэмэгдэнэ.

---

## 5. Эрхийн загвар (RBAC)

| Үйлдэл | Super Admin | Бусад staff (Admin/CEO/Manager) | Company operator |
|--------|-------------|--------------------------------|------------------|
| Компани CRUD | тийм | тодорхойлох (ихэвчлэн **үгүй**) | үгүй |
| Бүх компанийн жагсаалт | тийм | ? | үгүй |
| Өөрийн компанийн бараа CRUD | тийм (override) эсвэл зөвхөн унших — бодлого | ? | **зөвхөн өөрийн `companyId`** |
| Платформын бараа (legacy) | migration-оор шийднэ | | |

Шинэ middleware жишээ нэр:

- `requireSuperAdmin` — зөвхөн `role === "Super Admin"`.
- `requireCompanyScope` — JWT-д `companyId` байгаа бөгөөд `req.params.companyId` эсвэл body-тай таарна.

---

## 6. API-ийн ерөнхий төлөвлөгөө (Phase 2 хэрэгжилтэд)

**Super Admin — компани**

- `POST /api/companies` — компани үүсгэх.
- `GET /api/companies` — бүгдийг жагсаах (pagination, filter: status).
- `GET /api/companies/:id` — нэг компани.
- `PATCH /api/companies/:id` — засвар.
- `PATCH /api/companies/:id/status` — идэвхжүүлэх / түдгэлзүүлэх.

**Company scope — бараа**

- Одоогийн `POST /product/add`, `PATCH /product/edit-product/:id` гэх мэтийг **verifyToken + company scope**-той болгох эсвэл `/api/companies/:companyId/products/...` гэж namespace-лэх.
- `GET` public жагсаалт дээр: вэбсайт **нэг эсвэл олон компанийн** барааг харуулах бодлого (`websiteCompany.md`-д).

---

## 7. Нэвтрэлт (JWT)

Одоо: `{ _id, name, email, role }`.

Санал:

- Super Admin: `companyId` байхгүй эсвэл `null`.
- Company operator: `companyId: "<ObjectId>"`.
- Шалгалт: бараа үүсгэхэд `body.companyId` нь JWT-ийн `companyId`-тай таарч байх (Super Admin-ыг үл тоомсорлож болно).

---

## 8. Phase 1-ийн хүрээ (энэ баримт бичгийн төгсгөл)

- Дээрх **өгөгдөл, эрх, API нэршил, migration асуудал**-ыг баталгаажуулна.
- `AdminPanelCompany.md` — админ UI/UX, дэлгэцийн урсгал.
- `websiteCompany.md` — хэрэглэгчийн вэб дээр компани/дэлгүүр хэрхэн харагдах.

**Гүйцэтгэл (код)** нь Phase 2-оос эхэлнэ.
