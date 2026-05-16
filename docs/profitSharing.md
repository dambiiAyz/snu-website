# Referral Profit Sharing — Specification

Онлайн дэлгүүр — олон түвшний referral урамшууллын систем (MongoDB + Mongoose backend).

---

## 1. Зорилго

Хэрэглэгч referral code-оор найзаа урьж бүртгүүлнэ. **Referral chain** үүснэ. Доод түвшний хэрэглэгч худалдан авалт хийхэд тухайн **бараан дээрх `profitSharing`** дүнг худалдан авагчийн **хамгийн ойрын 3 шатны** урьсан хүмүүст хувиар нь хуваарилна. Урамшуулал **дотоод wallet**-д хуримтлагдана.

---

## 2. Referral бүтэц

- Хэрэглэгч бүр **өөрийн `referralCode`**-той.
- Шинэ хэрэглэгч бүртгэхдээ **урьсан хүний code** оруулна.

**Жишээ:** `A → B → C → D`

| Холбоос | Тайлбар |
|--------|---------|
| A | B-г урьсан |
| B | C-г урьсан |
| C | D-г урьсан |

---

## 3. Хуваарилалтын түвшин ба хувь

`D` худалдан авалт хийхэд `D`-ийн **шууд болон дээд 2 шатны урьсан** (нийт 3 хүн) урамшуулал авна.

| Level | Inviter (жишээ A→B→C→D) | Хувь |
|-------|-------------------------|------|
| 1 | C (шууд урьсан) | 57.14% |
| 2 | B | 28.57% |
| 3 | A | 14.29% |

**Сүлжээ урт бол:** `A → B → C → D → E` дээр `E` худалдан авалт хийвэл зөвхөн **D, C, B** авна; **A авахгүй** (хамгийн ойрын 3 шат).

---

## 4. Мөнгөн нэгж ба дөнгөжлөлт (MNT)

- Дүн бүгд **бүхэл төгрөг (integer)**; DB-д `Number` (integer) эсвэл `Long` зэргээр **таслалгүй** хадгална.
- **Алгоритм:** Level **2** болон Level **3**-ийн дүнг `floor(pool × хувь)`-аар тооцно. **Level 1**-ийн дүн = `pool − (level2Amount + level3Amount)` (үлдэгдлийг Level 1 авна — нийлбэр яг `pool` болно).

**Жишээ:** `profitSharing = 35,000₮` (нэг барааны pool)

| Level | Тооцоо | Дүн (₮) |
|-------|----------|---------|
| 2 (B) | floor(35000 × 0.2857) | 9,999 |
| 3 (A) | floor(35000 × 0.1429) | 5,001 |
| 1 (C) | 35000 − 9999 − 5001 | 20,000 |

**Жишээ:** `pool = 70,000₮` → C: 40,000; B: 20,000; A: 10,000.

---

## 5. `profitSharing` хаанаас

- **Order item бүр**-ийн холбогдох бараан дээрх `profitSharing`-ээр нэг **pool** тодорхойлно.
- Олон бараатай захиалгад: item тус бүрээр дээрх алгоритм (эсвэл pool нэг мөрөөр) — **item бүрээр** distribute (доорх idempotency түлхүүрт `orderItemId` орно).
- `profitSharing` нь **null эсвэл 0** бол тухайн item-д **reward distribute хийхгүй**.

---

## 6. Wallet систем

Урамшууллыг шууд бэлэн мөнгө болгохгүй; **`balance`**, **`totalEarned`** шинэчлэгдэнэ. (`totalWithdrawn` — Phase 1-д withdraw байхгүй ч талбарыг ирээдүйд бэлдэж болно.)

**Олголт:** `balance += amount`, `totalEarned += amount` (REFERRAL_REWARD).

---

## 7. MongoDB collection: `wallets`

| Талбар | Төрөл | Тайлбар |
|--------|--------|---------|
| `_id` | ObjectId | |
| `userId` | ObjectId ref users | **unique** эзэн |
| `balance` | integer (₮) | одоогийн үлдэгдэл (≥ 0) |
| `totalEarned` | integer (₮) | нийт орлого (нууц биш түүхийн нэг хэсэг) |
| `totalWithdrawn` | integer (₮) | нийт таталт (Phase 1-д ихэвчлэн 0) |
| `createdAt`, `updatedAt` | Date | |

---

## 8. MongoDB collection: `walletTransactions`

Бүх үлдэгдлийн өөрчлөлт **log**-д бичигдэнэ.

| Талбар | Төрөл | Тайлбар |
|--------|--------|---------|
| `_id` | ObjectId | |
| `walletId` | ObjectId | |
| `userId` | ObjectId | |
| `type` | string | доорх **Phase 1** төрлүүд |
| `amount` | integer (₮) | эерэг = нэмэх, сөрөг = хасах (логик дагуу) |
| `balanceBefore` | integer | |
| `balanceAfter` | integer | |
| `referenceType` | string | жишээ: `ORDER`, `ORDER_ITEM`, `REFERRAL_REWARD` |
| `referenceId` | ObjectId nullable | order / orderItem / referralReward гэх мэт |
| `metadata` | object optional | нэмэлт JSON (жишээ нь shortfall) |
| `description` | string optional | |
| `createdAt` | Date | |

### 8.1 `referenceType` (Phase 1)

| Утга | Хэрэглээ |
|------|----------|
| `ORDER` | Захиалгатай холбоотой |
| `ORDER_ITEM` | Мөртэй холбоотой |
| `REFERRAL_REWARD` | Referral урамшууллын бичилт |

### 8.2 Transaction `type` — Phase 1

| Type | Тайлбар |
|------|---------|
| `REFERRAL_REWARD` | Урамшуулал нэмэгдсэн |
| `REFUND` | Буцаалтаар урамшуулал/үлдэгдэл буцаасан |
| `ADMIN_ADD` | Админ нэмсэн |
| `ADMIN_DEDUCT` | Админ хассан |

**Phase 2 (одоогоор spec-д хэрэгжүүлэхгүй):** `PURCHASE` (wallet-аас төлөх), `WITHDRAW` — шаардлагатай бол дараа нь нэмнэ.

---

## 9. MongoDB collection: `referralRewards`

Идемпотент ба админ харагдааны үндэс.

| Талбар | Төрөл | Тайлбар |
|--------|--------|---------|
| `buyerUserId` | ObjectId | Худалдан авагч |
| `receiverUserId` | ObjectId | Урамшуулал авсан (upline) |
| `orderId` | ObjectId | |
| `orderItemId` | ObjectId | |
| `level` | 1 \| 2 \| 3 | |
| `percentage` | number | жишээ 0.5714 |
| `amount` | integer (₮) | |
| `status` | string | доорх enum |
| `createdAt` | Date | |

### 9.1 `referralRewards.status`

| Status | Тайлбар |
|--------|---------|
| `CONFIRMED` | DELIVERED дараа амжилттай олгогдсон |
| `REVERSED` | Refund зэргээр бүрэн эсвэл хэсгээр буцаагдсан |

---

## 10. Олгох цаг хугацаа

- Захиалга **үүсэхэд** reward **өгөхгүй**.
- **`ORDER_STATUS === DELIVERED`** болмогц distribute (нэг удаагийн, идемпотент урсгал).

**Шалтгаан:** хуурамч захиалга, цуцлалт, төлөөгүй, төлбөр амжилтгүй зэргээс хамгаална.

---

## 11. Буцаалт (refund)

- **Бүрэн refund:** тухайн захиалгын холбогдох `referralRewards` + wallet-аас **харгалзах дүнг хасна**; `walletTransactions` дээр `type: REFUND`.
- **Хэсэгчлэн refund:** зөвхөн **буцаагдсан item(үүд)**-ийн олгосон referral дүнгээр **пропорциональ эсвэл мөрөөр** (implementation: item-ийн олгосон `referralRewards` мөрүүдээр нь) буцаана.

### 11.1 Үлдэгдэл — сөрөг болгохгүй

- **`balance` 0-оос доош буурахгүй.**
- Буцаах ёстой дүн одоогийн `balance`-аас их бол: **`хасах = min(balance, буцаах дүн)`**.
- Бүрэн хасаж чадаагүй хэсгийг `walletTransactions.metadata` (жишээ нь `refundShortfall`) болон админ харагдаанд тулгуурлан **дараа нь** шийдвэрлэнэ (Phase 1-д withdraw байхгүй тул энэ тохиолдол ховор).

---

## 12. Хэрэглэгч — referral талбарууд (одоо байгаа загварт **нэмнэ**)

`users` collection дээр доорхыг **нэмэх** (бусад талбаруудыг устгах/орлуулахгүй):

| Талбар | Тайлбар |
|--------|---------|
| `referralCode` | Уникаль code |
| `invitedByUserId` | ObjectId nullable; бүртгэлийн үед тохируулна, **дараа нь өөрчлөгдөхгүй** |

### 12.1 Хязгаарлалт

- **Өөрийн code** ашиглаж бүртгүүлэхийг **хориглоно**.
- **Тойргийн chain** (жишээ `A → B → C → A`) үүсгэхийг бүртгэлийн үед шалгаж **хориглоно**.

---

## 13. Идемпотент байдал

Давхар олголтоос сэргийлэх **unique түлхүүр:**

`orderId` + `orderItemId` + `receiverUserId` + `level`

```js
// Жишээ индекс
db.referralRewards.createIndex(
  { orderId: 1, orderItemId: 1, receiverUserId: 1, level: 1 },
  { unique: true }
);
```

**Урсгал:** distribute-ийн өмнө ижил түлхүүрээр бичлэг байвал **SKIP**; байхгүй бол create (transaction дотор).

---

## 14. MongoDB transaction

Нэг **client session transaction** дотор дараахыг атомар хийх:

1. `referralRewards` insert (эсвэл идемпотент шалгалт)
2. `wallets` шинэчлэл
3. `walletTransactions` insert

**Анхаарах:** олон түвшний transaction ихэнх орчинд **MongoDB replica set** шаардлагатай. Local dev-д replica setгүй бол transaction алдаатай байж болно — орчны тохиргоог README эсвэл dev doc-д заавал тэмдэглэнэ.

---

## 15. Захиалгын төлөв (зөвлөмж)

| Status | Тайлбар |
|--------|---------|
| `PENDING` | Үүссэн |
| `PAID` | Төлбөр амжилттай |
| `SHIPPED` | Илгээсэн |
| `DELIVERED` | **Reward distribute** энд |
| `CANCELLED` | Урамшуулалгүй (deliver хийгдээгүй гэж үзнэ) |
| `REFUNDED` | Буцаалтын дараа reward буцаасан |

---

## 16. Тархалтын урсгал (жишээ)

`A → B → C → D`, нэг item `profitSharing = 35,000₮`, статус `DELIVERED`:

1. C wallet +20,000₮ (+ `REFERRAL_REWARD`)
2. B wallet +9,999₮
3. A wallet +5,001₮

(Дүн нь хэсэг 4-ийн дөнгөжлөлттэй нийцнэ.)

---

## 17. Төслийн хүрээ (Phase 1)

**Оруулна:**

- Referral бүртгэл, chain
- DELIVERED дээр distribute + wallet + transaction log
- Refund буцаалт (хэсэг 11)
- Админ урамшууллын харагдаан (`referralRewards` / log)

**Оруулахгүй (Phase 1):**

- Withdraw, wallet-аас төлбөр, хэрэглэгч хоорондын шилжүүлэг, QPay/crypto таталт
- Заавал **queue** (BullMQ/Redis) — шаардлага биш; идемпотент + transaction хангалттай. Ирээдүйд ачаалал өссөн үед async job **сонголт** болгон нэмж болно.

---

## 18. Одоогийн backend стек (энэ репо)

| Давхарга | Технологи |
|----------|-----------|
| Runtime | Node.js |
| API | **Express** |
| DB | MongoDB |
| ODM | **Mongoose** |

Queue / Redis / NestJS — энэ spec-ийн **заавал шаардлага биш**.

---

## Холбоос — implementation ба UI

| Файл | Агуулга |
|------|---------|
| [profitSharingFrontend.md](./profitSharingFrontend.md) | Frontend: signup, wallet, order status-ийн API |
| [profitSharingAdmin.md](./profitSharingAdmin.md) | Admin: referral жагсаалт, хэсэгчлэн refund |

**Backend код:** `services/referralReward.service.js`, загвар `Wallet`, `WalletTransaction`, `ReferralReward`, `User` / `Products` / `Order` өргөтгөлтүүд. Орчин: `REFERRAL_USE_TRANSACTIONS=false` бол Mongo transaction ашиглахгүй (replica setгүй dev).

---

## Хувилбар

| Огноо | Өөрчлөлт |
|-------|----------|
| — | Spec-ийг нэгтгэсэн, дугаарласан; сөрөг balance хориглосон; NestJS/BullMQ заавал гэснийг хассан; Phase 1 transaction type нэгтгэсэн. |
