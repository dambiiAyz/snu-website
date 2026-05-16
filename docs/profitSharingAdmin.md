# Referral & profit sharing — Admin spec

Эх үндсэн дүрэм: [profitSharing.md](./profitSharing.md)

## Нэвтрэлт

Админ панел **Admin** JWT ашиглана (`POST /api/admin/login`)-ийн `token`.  
Эсвэл `User` загварын `role: "admin"` (хуучин) — хоёуланд `Authorization: Bearer <token>`.

Эдгээр эрхтэй үед доорх staff-only замууд ажиллана: `Admin`, `Super Admin`, `Manager`, `CEO` (Admin collection), эсвэл `admin` (User).

---

## 1. Referral урамшууллын жагсаалт

`GET /api/admin/referral-rewards`

Query (сонголттой):

| Параметр | Утга |
|----------|------|
| `orderId` | Захиалгаар шүүх |
| `receiverUserId` | Урамшуулал авсан хэрэглэгч |
| `buyerUserId` | Худалдан авагч |
| `status` | `CONFIRMED` \| `REVERSED` |
| `page` | Хуудаслалт (анхдагч 1) |
| `limit` | Мөр (анхдагч 50, max 200) |

**Response:** `data.items` — `buyerUserId`, `receiverUserId` populate (`name`, `email`), бусад талбарууд `profitSharing.md`-тай ижил.

---

## 2. Хэсэгчлэн буцаалт (referral-оос хасах)

Захиалгын `cart[]` доторх мөр бүрийн **`lineItemId`** (backend автоматаар үүсгэнэ) ашиглана.

`POST /api/order/:orderId/referral-refund-lines`

Header: `Authorization: Bearer <staff_jwt>`

Body:

```json
{
  "lineItemIds": ["64a1...", "64a2..."]
}
```

**Үр дүн:** `data.reversed` — `REVERSED` болгосон `referralRewards` мөрийн тоо; холбогдох хэрэглэгчийн wallet-аас `min(balance, amount)` зарчмаар хасна (дэлгэрэнгүй: `profitSharing.md` хэсэг 11).

---

## 3. Захиалгын төлөв өөрчлөх (админ / дэлгүүр)

`PATCH /api/order/update-status/:orderId`

Body жишээ:

```json
{ "status": "delivered" }
```

- **Delivered:** referral distribute (давтвал skip).
- **refunded** эсвэл **cancel** (өмнө нь `delivered` байсан бол): бүтэн referral буцаалт.

Одоогийн энэ замд **staff шалгалт байхгүй** — production-д middleware нэмэх эсвэл зөвхөн дотоод сүлжээнээс дуудахыг зөвлөмжилнө.

---

## 4. Бараа — `profitSharing`

Админ бараа үүсгэх/засах API-д body-д **`profitSharing`** (бүхэл MNT, нэгж бүтээгдэхүүн) талбарыг оруулна (`POST /api/product` гэх мэт, одоогийн product controller-д дамжина).

`0` эсвэл талбаргүй → тухайн мөрөөр referral distribute **хийхгүй**.

---

## 5. SuperAdmin (ирээдүйн төсөл)

Одоогийн staff middleware нь **бүх** `Super Admin` / `Admin` / `Manager` / `CEO`-д ижил `referral-rewards` list + partial refund эрх өгнө. SuperAdmin-only эрхийг ялгах бол JWT payload эсвэл тусад нь middleware нэмнэ.

---

## Холбоос

| Документ | Зориулалт |
|----------|-----------|
| [profitSharing.md](./profitSharing.md) | Бизнес дүрэм, тоо, DB |
| [profitSharingFrontend.md](./profitSharingFrontend.md) | Хэрэглэгчийн UI + user API |
