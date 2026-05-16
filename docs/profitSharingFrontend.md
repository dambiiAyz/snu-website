# Referral & profit sharing — Frontend spec

Эх үндсэн дүрэм: [profitSharing.md](./profitSharing.md)

## Base URL

Бүх замууд нь backend-ийн суурь URL (жишээ `http://localhost:7001`)-тай нэгдэнэ.

---

## 1. Бүртгэл (referral)

### Email signup

`POST /api/user/signup`

| Body талбар | Заавал | Тайлбар |
|-------------|--------|---------|
| `name`, `email`, `password` | Тийм | Өмнөх шиг |
| `referralCode` | Үгүй | Урьсан хүний **referralCode** (case-insensitive, backend uppercase болгоно) |

**Алдаа 400:** `Invalid referral code` эсвэл `Referral data conflict...`

**Анхаар:** `invitedByUserId`-ийг клиентээс бүү илгээ; зөвхөн `referralCode` ашиглана.

### Google / provider signup

`POST /api/user/register/:token`

- Body-д нэмэлтээр `referralCode` (сонголттой) дамжуулж болно (шинэ хэрэглэгч үүсэх үед л хэрэгтэй).

---

## 2. Нэвтрэлтийн дараа referral мэдээлэл

`GET /api/user/referral-info`  
Header: `Authorization: Bearer <user_jwt>`

**Response `data`:**

| Талбар | Утга |
|--------|------|
| `referralCode` | Хуваалцах код (урьлга линкэнд ашиглана) |
| `invitedByUserId` | Урьсан хүний `_id` эсвэл `null` |

---

## 3. Wallet (хэрэглэгч)

### Үлдэгдэл

`GET /api/user/wallet`  
Header: `Authorization: Bearer <user_jwt>`

**Response `data`:** `balance`, `totalEarned`, `totalWithdrawn` (бүхэл төгрөг, MNT).

### Гүйлгээний түүх

`GET /api/user/wallet/transactions?page=1&limit=20`

**Response `data`:** `items[]`, `total`, `page`, `limit`  
`items` дотор: `type` (`REFERRAL_REWARD` | `REFUND` | …), `amount`, `balanceBefore`, `balanceAfter`, `referenceType`, `metadata`, `createdAt`.

---

## 4. Захиалгын төлөв (олголт триггер)

Одоогийн API: `PATCH /api/order/update-status/:orderId`  
Body: `{ "status": "<төлөв>" }`

Төлөвийг **жижиг үсгээр** илгээнэ: `pending` | `processing` | `delivered` | `cancel` | `refunded`

**Урамшуулал:** зөвхөн `delivered` болсон үед backend автоматаар referral distribute хийнэ (давтвал идемпотент).

**Буцаалт:** `delivered` байсан захиалгыг `refunded` эсвэл `cancel` болгосон үед wallet-аас referral буцаалт эхэлнэ.

---

## 5. UI-ийн санал

- Бүртгэлийн хуудас: "Урилгын код" талбар (сонголттой).
- Профайл / Rewards: `referralCode` хуулах товч, эсвэл линк `?ref=CODE`.
- Захиалгын дэлгэрэнгүй: төлөвийн workflow админтай нийцтэй байх.

---

## Холбоос

| Документ | Зориулалт |
|----------|-----------|
| [profitSharing.md](./profitSharing.md) | Бизнес дүрэм, тоо, DB |
| [profitSharingAdmin.md](./profitSharingAdmin.md) | Админ API ба дэлгэц |
