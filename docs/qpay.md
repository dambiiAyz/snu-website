# QPay Integration Guide

Энэ файл нь SNU backend/mobile app дээр QPay холбох, web/deploy орчинд тохируулах заавар.

## 1. QPay Merchant Мэдээлэл

QPay-ээс авсан мэдээлэл:

```text
Auth token URL: https://merchant.qpay.mn/v2/auth/token
Username:
Invoice code: _INVOICE
```

Password-г public repo, frontend, mobile app дотор бүү хадгал. Зөвхөн backend `.env` эсвэл deploy platform-ийн Environment Variables хэсэгт хийнэ.

## 2. Backend Environment Variables

Backend дээр дараах env-үүдийг тохируулна.

Local `.env` жишээ:

```env
QPAY_BASE_URL=https://merchant.qpay.mn/v2
QPAY_USERNAME=
QPAY_PASSWORD=your_qpay_password
QPAY_INVOICE_CODE=_INVOICE
QPAY_CALLBACK_URL=http://localhost:7001/api/qpay/callback
```

Production/deployed үед:

```env
QPAY_BASE_URL=https://merchant.qpay.mn/v2
QPAY_USERNAME=
QPAY_PASSWORD=your_qpay_password
QPAY_INVOICE_CODE=_INVOICE
QPAY_CALLBACK_URL=https://your-backend-domain.com/api/qpay/callback
```

Анхаарах зүйл:

- Local `localhost:7001` рүү QPay өөрөөсөө callback дуудаж чадахгүй.
- Production дээр `QPAY_CALLBACK_URL` нь public HTTPS URL байх ёстой.
- Local test хийх үед callback хүлээхийн оронд payment check endpoint-г app/backend-оос өөрөө дуудна.

## 3. Backend Endpoints

QPay route base:

```text
/api/qpay
```

### 3.1 QPay invoice үүсгэх

```http
POST /api/qpay/invoice
Content-Type: application/json
```

Order-той холбож invoice үүсгэх body:

```json
{
  "orderId": "ORDER_ID"
}
```

Order байхгүйгээр amount-аар invoice үүсгэх body:

```json
{
  "amount": 1000,
  "senderInvoiceNo": "SNU-TEST-1001",
  "description": "Test order"
}
```

Амжилттай response:

```json
{
  "success": true,
  "data": {
    "order": {},
    "invoice": {
      "invoice_id": "qpay_invoice_id",
      "qr_text": "QR text",
      "qr_image": "base64 image",
      "qPay_shortUrl": "https://s.qpay.mn/...",
      "urls": [
        {
          "name": "Khan bank",
          "description": "Khan bank",
          "logo": "https://qpay.mn/q/logo/khanbank.png",
          "link": "khanbank://q?..."
        }
      ]
    }
  }
}
```

Mobile/web талд ашиглах гол талбарууд:

- `data.invoice.invoice_id`
- `data.invoice.qr_image`
- `data.invoice.qr_text`
- `data.invoice.qPay_shortUrl`
- `data.invoice.urls`

### 3.2 Төлбөр төлөгдсөн эсэхийг шалгах

```http
POST /api/qpay/invoice/:invoiceId/check
```

Жишээ:

```http
POST /api/qpay/invoice/d50f49f2-9032-4a74-8929-530531f28f63/check
```

Амжилттай response:

```json
{
  "success": true,
  "data": {
    "paid": true,
    "order": {},
    "payment": {}
  }
}
```

`data.paid === true` бол төлбөр амжилттай төлөгдсөн гэж үзнэ.

Backend дээр linked order байвал:

- `order.qpay.paymentStatus` шинэчлэгдэнэ
- `order.qpay.paymentId` хадгалагдана
- `order.qpay.paidAmount` хадгалагдана
- QPay status `PAID` бол order `status` нь `processing` болно

### 3.3 QPay Callback URL

QPay callback:

```http
GET /api/qpay/callback?qpay_payment_id=PAYMENT_ID
```

Мөн POST callback дэмжинэ:

```http
POST /api/qpay/callback
Content-Type: application/json

{
  "payment_id": "PAYMENT_ID"
}
```

Backend callback авах үед:

1. `payment_id` авна.
2. QPay `/payment/:paymentId` API-г дуудаж verify хийнэ.
3. Payment-ийн invoice/order мэдээллээр order update хийнэ.
4. Response:

```json
{
  "success": true,
  "orderId": "ORDER_ID"
}
```

### 3.4 Invoice cancel

```http
DELETE /api/qpay/invoice/:invoiceId
```

Response:

```json
{
  "success": true,
  "data": {}
}
```

## 4. Mobile/Web Payment Flow

Recommended flow:

### Алхам 1. Order үүсгэнэ

```http
POST /api/order/saveOrder
Content-Type: application/json
```

Response-оос order id авна:

```json
{
  "success": true,
  "order": {
    "_id": "ORDER_ID"
  }
}
```

### Алхам 2. QPay invoice үүсгэнэ

```http
POST /api/qpay/invoice
Content-Type: application/json

{
  "orderId": "ORDER_ID"
}
```

### Алхам 3. QR/deeplink харуулна

Web/mobile UI дээр:

- QR image: `data.invoice.qr_image`
- Bank app buttons: `data.invoice.urls`
- Universal short URL: `data.invoice.qPay_shortUrl`

QR image-г харуулах:

```text
data:image/png;base64,<qr_image>
```

Хэрвээ backend/mobile service аль хэдийн `data:image/png;base64,` prefix нэмсэн бол дахин нэмэхгүй.

### Алхам 4. Төлбөр шалгана

Хэрэглэгч банкны app-аас буцаж ирсний дараа эсвэл "Төлбөр шалгах" товч дарахад:

```http
POST /api/qpay/invoice/:invoiceId/check
```

Хэрвээ response:

```json
{
  "success": true,
  "data": {
    "paid": true
  }
}
```

бол UI дээр:

```text
Төлбөр амжилттай төлөгдлөө
```

гэсэн toast/message харуулна. Дараа нь хэрэглэгч back товч дарж өмнөх screen рүү буцна.

## 5. Local Test

Backend local асаах:

```bash
cd snu-backend
npm run start-dev
```

эсвэл:

```bash
node index.js
```

Local base URL:

```text
http://localhost:7001
```

Invoice үүсгэх curl:

```bash
curl -X POST http://localhost:7001/api/qpay/invoice \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"senderInvoiceNo":"SNU-TEST-1001","description":"Test invoice"}'
```

Payment check curl:

```bash
curl -X POST http://localhost:7001/api/qpay/invoice/INVOICE_ID/check
```

## 6. Production Checklist

- Backend deploy хийгдсэн public HTTPS domain-той байх.
- Deploy environment variables дээр QPay env-үүд нэмэгдсэн байх.
- `QPAY_CALLBACK_URL` public HTTPS URL байх:

```text
https://your-backend-domain.com/api/qpay/callback
```

- Mobile/web app backend base URL нь production backend рүү заасан байх.
- QPay merchant dashboard/support дээр callback URL тохируулсан байх.
- Password/token frontend/mobile тал руу огт явуулахгүй байх.
- QPay invoice create response дотор `qr_image`, `urls`, `qPay_shortUrl` ирж байгаа эсэхийг шалгах.
- Bank app-аар төлсний дараа `/api/qpay/invoice/:invoiceId/check` `paid: true` буцааж байгаа эсэхийг шалгах.

## 7. Backend Log-ууд

QPay дээр debug log нэмсэн.

Жишээ log:

```text
[qpay:controller] create invoice api start
[qpay:service] auth token start
[qpay:service] create invoice
[qpay:controller] create invoice qpay success
[qpay:controller] check invoice api success
```

Log дээр дараах зүйлсийг intentionally хэвлэхгүй:

- QPay password
- Basic/Bearer token
- Full QR image base64

## 8. Common Issues

### QPay callback local дээр ирэхгүй

`localhost` нь зөвхөн таны computer дээр ажилладаг тул QPay server callback дуудаж чадахгүй. Local test дээр manual check endpoint ашиглана.

### `QPay configuration missing`

Backend env дээр дараахуудаас нэг нь дутуу:

```text
QPAY_USERNAME
QPAY_PASSWORD
QPAY_INVOICE_CODE
```

### `sender_invoice_no` давхцаж байна

QPay дээр `sender_invoice_no` unique байх ёстой. Нэг invoice number-г дахин ашиглаж болохгүй.

Order-той invoice үүсгэхэд backend default:

```text
SNU-<order.invoice эсвэл order._id>
```

ашиглаж байна.
