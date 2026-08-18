# Product Detail Admin Preview Design

Зорилго: Admin хэсэгт бүтээгдэхүүн нэмэх/засах үед хэрэглэгчийн талын Product detail хуудас ямар харагдахыг **live preview** байдлаар харуулах UI design.

Source spec: `docs/productDetailPreviewSpec.md`

---

## 1. Дизайны үндсэн санаа

Admin product form нь 2 үндсэн бүстэй байна:

| Бүс | Үүрэг |
|---|---|
| Зүүн талын form | Admin бүтээгдэхүүний data оруулна, засна. |
| Баруун талын preview | Яг хэрэглэгчийн Product detail хуудастай ойролцоо live preview харуулна. |

Desktop layout:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│ Product / Add product                                            [Save]    │
├──────────────────────────────────────┬─────────────────────────────────────┤
│ FORM                                 │ LIVE PREVIEW                         │
│                                      │                                     │
│ Ерөнхий мэдээлэл                    │ ┌─────────────────────────────────┐ │
│ Үнэ ба нөөц                         │ │ Product detail preview          │ │
│ Зураг ба өнгө                       │ │                                 │ │
│ Нэмэлт мэдээлэл                     │ │ [image gallery] [title/price]   │ │
│ SEO/Tags                            │ │ [tabs: desc/additional/review]  │ │
│                                      │ └─────────────────────────────────┘ │
└──────────────────────────────────────┴─────────────────────────────────────┘
```

Mobile/tablet layout:

```text
┌──────────────────────────────┐
│ Product / Add product        │
├──────────────────────────────┤
│ [Form] [Preview] segmented   │
├──────────────────────────────┤
│ Сонгосон tab-ийн content     │
└──────────────────────────────┘
```

---

## 2. Page header

| Элемент | Тайлбар |
|---|---|
| Breadcrumb | `Admin / Products / Add product` эсвэл `Admin / Products / Edit product` |
| Page title | `Бүтээгдэхүүн нэмэх` эсвэл `Бүтээгдэхүүн засах` |
| Status pill | `Draft`, `Ready to publish`, `Published`, `Validation needed` |
| Primary action | `Хадгалах` |
| Secondary action | `Ноорог хадгалах` |
| Utility action | `Preview full page` |

Header behavior:

- Form-д required data дутуу бол status pill `Validation needed`.
- Required data бүрдсэн бол `Ready to publish`.
- `Preview full page` нь modal эсвэл new tab preview route нээнэ.

---

## 3. Form section design

### 3.1. Ерөнхий мэдээлэл

| Field | UI control | Preview-д нөлөөлөх хэсэг |
|---|---|---|
| Бүтээгдэхүүний нэр | Text input | Breadcrumb title, product title |
| Ангилал | Select/search select | Category label, breadcrumb, bottom info |
| Нийлүүлэгч компани | Select/search select | `Нийлүүлэгч:` link |
| SKU | Text input | Bottom info SKU |
| Тайлбар | Rich textarea эсвэл textarea | Right short description, Description tab |

Design note:

- Product title input-ийн доор character helper: `0/120`.
- Description textarea-ийн доор `Эхний 100 тэмдэгт баруун талын богино тайлбарт харагдана` гэсэн helper text-г жижиг, subdued style-аар харуулж болно.

### 3.2. Үнэ ба нөөц

| Field | UI control | Preview-д нөлөөлөх хэсэг |
|---|---|---|
| Үнэ | Numeric input | Price |
| Хямдрал хувь | Numeric input эсвэл slider | Old/new price |
| Нөөцийн төлөв | Segmented control: `Бэлэн`, `Дууссан` | Stock badge, disabled actions |
| Flash sale end date | Date-time picker | Countdown |

Price preview helper:

```text
Үнэ: ₮99,000
Хямдрал: 10%
Preview дээр харагдах үнэ: ₮89,100
```

### 3.3. Зураг ба өнгө

| Field | UI control | Preview-д нөлөөлөх хэсэг |
|---|---|---|
| Product images | Upload/dropzone + sortable list | Thumbnail gallery, main image |
| Default image | Radio/default marker | Initial main image |
| Color name | Per-image color select/input | Color swatches |
| Video ID | Text input | Play button + popup video |

Image list item design:

```text
┌──────┬──────────────────────────────┬────────────┬──────────┐
│ img  │ product-main.jpg             │ Color      │ Default  │
│      │ 1200 x 1200                  │ [Black ▼]  │ (●)      │
└──────┴──────────────────────────────┴────────────┴──────────┘
```

Rules:

- Хамгийн багадаа 1 image шаардана.
- Default image сонгоогүй бол эхний image-г default гэж preview-д үзүүлнэ.
- Color name-тэй image байвал preview дээр color swatch section гарна.

### 3.4. Нэмэлт мэдээлэл

Table editor:

| Key | Value | Action |
|---|---|---|
| Материал | Cotton | Delete |
| Хэмжээ | M | Delete |

Controls:

- `+ Нэмэлт мөр` button
- Empty үед `Нэмэлт мэдээлэл оруулаагүй байна` empty state

Preview нөлөө:

- Additional information tab дээр key/value table болж харагдана.

### 3.5. Tags

Control:

- Tag input with chips.
- Жишээ: `new`, `school`, `gift`

Preview нөлөө:

- Одоогийн Product detail дээр зөвхөн `tags[0]` bottom info-д харагдана.

---

## 4. Live preview panel

Preview panel нь Admin UI дотор framed product detail харагдуулна.

### 4.1. Preview toolbar

```text
┌────────────────────────────────────────────────────────────┐
│ Live preview                          [Desktop] [Mobile]   │
│ Хэрэглэгчийн product detail харагдах байдлын ойролцоо хувилбар │
└────────────────────────────────────────────────────────────┘
```

Toolbar controls:

| Control | Тайлбар |
|---|---|
| Desktop/Mobile segmented control | Preview viewport сольж харуулна. |
| Refresh/reset preview | Form state-ээс preview object дахин normalize хийнэ. |
| Open full preview | Full page/modal preview нээнэ. |

### 4.2. Preview content

Preview нь хэрэглэгчийн Product detail component-тэй ижил дараалалтай байна:

```text
┌────────────────────────────────────────────────────────────┐
│ Breadcrumb: Ангилал / Бүтээгдэхүүний нэр                   │
├──────────────────────────────┬─────────────────────────────┤
│ Thumbnail + main image       │ Category                    │
│                              │ Нийлүүлэгч: Company         │
│ [out-stock badge]            │ Product title               │
│ [video play]                 │ Stock + rating              │
│                              │ Description excerpt         │
│                              │ Price / discounted price    │
│                              │ Color swatches              │
│                              │ Countdown                   │
│                              │ Quantity + Add to cart      │
│                              │ SKU / Category / Tag        │
├────────────────────────────────────────────────────────────┤
│ Tabs: Description | Additional information | Reviews       │
└────────────────────────────────────────────────────────────┘
```

Preview mode-д дараах action-ууд real side effect хийхгүй:

- Add to cart
- Buy now
- Add to compare
- Add to wishlist
- Review submit
- Supplier link navigation

Эдгээрийг disabled эсвэл tooltip-тэй noop болгоно:

`Preview mode: энэ action хэрэглэгчийн тал дээр ажиллана.`

---

## 5. Preview states

| State | Хэзээ | UI |
|---|---|---|
| Empty draft | Form анх хоосон | Placeholder title, placeholder image, price `₮0.00` |
| Partial data | Зарим field бөглөгдсөн | Бөглөгдсөн хэсэг live update, дутуу хэсэг placeholder |
| Ready | Required fields бүрдсэн | Preview real product шиг харагдана |
| Out of stock | `status = out-of-stock` | Badge гарна, cart/wishlist/compare disabled |
| Discount active | `discount > 0` | Old price + new price |
| Flash sale active | `offerDate.endDate` future date | Countdown running |
| Flash sale expired | `offerDate.endDate` past date | Countdown `0` |
| No reviews | `reviews = []` | Review count 0, empty text |
| No additional info | `additionalInformation = []` | Additional tab empty state |

---

## 6. Validation + preview fallback

Required fields:

| Field | Validation | Preview fallback |
|---|---|---|
| `title` | Required | `Бүтээгдэхүүний нэр` |
| `category.name` | Required | `Ангилал` |
| `price` | Required, number >= 0 | `₮0.00` |
| `status` | Required enum | `in-stock` |
| `description` | Required | `Бүтээгдэхүүний тайлбар` |
| `imageURLs` | At least 1 | Placeholder product image |

Optional fields:

| Field | Preview fallback |
|---|---|
| `sku` | `-` |
| `discount` | `0` |
| `company` | Supplier row hidden |
| `videoId` | Video button hidden |
| `tags` | `-` |
| `additionalInformation` | Empty state |
| `reviews` | Empty review state |

---

## 7. Visual style

Admin UI should feel operational and scan-friendly.

| Token | Recommendation |
|---|---|
| Background | `#f6f7f9` page background |
| Surface | `#ffffff` panels |
| Border | `#e5e7eb` |
| Text primary | `#111827` |
| Text muted | `#6b7280` |
| Accent | Use existing SNU/shop primary color if available |
| Success | `#16a34a` for in-stock |
| Danger | `#dc2626` for out-of-stock/errors |
| Radius | 6px-8px |
| Spacing | 16px panel gap, 20px section padding |

Preview panel styling:

- White surface.
- Border эсвэл subtle shadow.
- Preview content scrollable байж болно.
- Product detail real CSS ашиглаж байгаа бол wrapper дээр max width/scale тогтоож Admin layout эвдэхгүй болгоно.

---

## 8. Desktop responsive behavior

| Viewport | Layout |
|---|---|
| `>= 1280px` | Form 42%, Preview 58%, preview sticky top |
| `1024px - 1279px` | Form 45%, Preview 55% |
| `768px - 1023px` | Top segmented `Form / Preview`, нэг нэгээр харуулна |
| `< 768px` | Single column, preview mobile viewport mode default |

Sticky preview:

- Desktop дээр preview panel `position: sticky; top: 88px`.
- Panel доторх preview content өөрөө scroll хийж болно.

---

## 9. Suggested component breakdown

```text
AdminProductEditorPage
├─ ProductEditorHeader
├─ ProductEditorLayout
│  ├─ ProductFormPanel
│  │  ├─ ProductGeneralSection
│  │  ├─ ProductPricingSection
│  │  ├─ ProductMediaSection
│  │  ├─ ProductAdditionalInfoSection
│  │  └─ ProductTagsSection
│  └─ ProductPreviewPanel
│     ├─ ProductPreviewToolbar
│     └─ ProductPreviewFrame
│        └─ ProductDetailsContent previewMode
```

Preview-д reuse хийх санал:

```jsx
<ProductDetailsContent
  productItem={previewProduct}
  previewMode
  showRelatedProducts={false}
  showReviewForm={false}
/>
```

---

## 10. Interaction flow

1. Admin product form нээнэ.
2. Form state-ээс `previewProduct` object normalize хийнэ.
3. Admin field өөрчлөх бүрт preview object update болно.
4. Preview panel тухайн update-г шууд харуулна.
5. Admin `Preview full page` дарахад том modal эсвэл `/admin/products/preview` route дээр preview state харуулна.
6. Required fields бүрдсэн үед `Хадгалах` enabled болно.
7. Save хийсний дараа backend-с ирсэн product `_id`-аар real `/product-details/:id` page руу нээж шалгах боломжтой.

---

## 11. Acceptance criteria

1. Product title, category, price, description, image өөрчлөхөд preview шууд шинэчлэгдэнэ.
2. Discount оруулахад old/new price зөв тооцогдож харагдана.
3. Out-of-stock сонгоход badge гарч action buttons disabled болно.
4. Олон image upload хийвэл thumbnail list болон main image зөв ажиллана.
5. Default image сонгоход preview-ийн эхний main image өөрчлөгдөнө.
6. Color сонгосон image байвал color swatch section гарна.
7. Additional information rows tab дээр table хэлбэрээр харагдана.
8. Preview mode-д cart/review/wishlist зэрэг real action ажиллахгүй.
9. Mobile preview mode дээр product detail жижиг дэлгэцийн layout-аар шалгагдана.
10. Required field хоосон байсан ч preview crash хийхгүй placeholder утгаар ажиллана.

