# Product Detail Preview Spec

Зорилго: Admin хэсэгт бүтээгдэхүүн нэмэх/засах үед хэрэглэгчийн талын **Product detail** хуудас дээр тухайн талбарууд хаана, ямар утгаар харагдахыг preview байдлаар гаргахад зориулсан mapping баримт.

Одоогийн frontend route:

- Dynamic detail: `/product-details/[id]`
- Static demo detail: `/product-details`
- Single product API: `GET /api/product/single-product/:id`
- Related products API: `GET /api/product/related-product/:id`

Гол component урсгал:

`ProductDetailsArea` -> `ProductDetailsBreadcrumb` + `ProductDetailsContent` -> `DetailsThumbWrapper` + `DetailsWrapper` + `DetailsTabNav` + `RelatedProducts`

---

## 1. Page-ийн ерөнхий бүтэц

| Хэсэг | Frontend component | Харагдах байрлал | Admin preview-д хэрэгтэй data |
|---|---|---|---|
| Header/Footer | `HeaderTwo`, `Footer` | Хуудасны дээд/доод ерөнхий layout | Preview-д заавал editable биш. |
| Breadcrumb | `ProductDetailsBreadcrumb` | Product detail-ийн дээр | `category.name`, `title` |
| Зураг/gallery | `DetailsThumbWrapper` | Зүүн тал | `imageURLs`, `imageURLs[].img`, `imageURLs[].isDefault`, `videoId`, `status` |
| Үндсэн мэдээлэл | `DetailsWrapper` | Баруун тал | `category`, `company`, `title`, `status`, `reviews`, `description`, `price`, `discount`, `imageURLs[].color`, `offerDate`, `sku`, `tags` |
| Description tabs | `DetailsTabNav` | Доод хэсэг | `description`, `additionalInformation`, `reviews`, `_id` |
| Related products | `RelatedProducts` | Хамгийн доод carousel | `_id`-аар related API дуудна. Admin preview-д optional. |

---

## 2. Product object-ийн санал болгож буй shape

Admin preview component руу доорх object-той ойролцоо data дамжуулахад одоогийн frontend-тэй хамгийн ойр ажиллана.

```json
{
  "_id": "product_id",
  "sku": "SKU-001",
  "title": "Бүтээгдэхүүний нэр",
  "description": "Бүтээгдэхүүний дэлгэрэнгүй тайлбар...",
  "price": 99000,
  "discount": 10,
  "status": "in-stock",
  "category": {
    "_id": "category_id",
    "name": "Ангиллын нэр"
  },
  "company": {
    "_id": "company_id",
    "name": "Нийлүүлэгч компани",
    "slug": "company-slug"
  },
  "imageURLs": [
    {
      "img": "https://example.com/product-main.jpg",
      "isDefault": true,
      "color": {
        "name": "Black"
      }
    }
  ],
  "videoId": "youtube_video_id",
  "tags": ["tag-1", "tag-2"],
  "offerDate": {
    "endDate": "2026-12-31T23:59:59.000Z"
  },
  "additionalInformation": [
    {
      "key": "Материал",
      "value": "Cotton"
    }
  ],
  "reviews": [
    {
      "_id": "review_id",
      "rating": 5,
      "comment": "Сайн бүтээгдэхүүн байна.",
      "createdAt": "2026-08-17T00:00:00.000Z",
      "userId": {
        "name": "User Name",
        "imageURL": ""
      }
    }
  ]
}
```

---

## 3. Зүүн талын image/gallery mapping

Component: `DetailsThumbWrapper`

| UI элемент | Data талбар | Тайлбар |
|---|---|---|
| Thumbnail жагсаалт | `imageURLs[]` | Зүүн талд жижиг зургууд болж харагдана. |
| Thumbnail image | `imageURLs[].img` | `img` нь absolute URL эсвэл Next Image-д зөвшөөрөгдсөн source байх хэрэгтэй. |
| Main image | active image буюу default variant-ийн `img` | Эхэндээ `imageURLs.find(isDefault)` эсвэл байхгүй бол `imageURLs[0]` сонгогдоно. |
| Active thumbnail state | `activeImg === item.img` | Thumbnail дарахад main image солигдоно. |
| Out of stock badge | `status === "out-of-stock"` | Main image дээр `out-stock` badge гарна. |
| Video play button | `videoId` | `videoId` байвал зураг дээр play button гарч popup video нээгдэнэ. |

Admin preview шаардлага:

- `imageURLs` дор хаяж 1 зурагтай байх.
- Нэг зураг `isDefault: true` байвал preview эхлэх main image тодорхой болно.
- `color`-гүй зураг байж болно, гэхдээ color variation хэсэг гарахгүй байж магадгүй.
- `videoId` optional. Байхгүй үед play button нуух.

---

## 4. Баруун талын үндсэн мэдээллийн mapping

Component: `DetailsWrapper`

| UI элемент | Data талбар | Render logic |
|---|---|---|
| Ангилал label | `category.name` | Title-ийн дээр жижиг text. |
| Нийлүүлэгч | `company.name` + `company.slug` эсвэл `companyName` + `companySlug` | Аль аль нь байвал `/companies/:slug` link гарна. |
| Product title | `title` | Том гарчиг. |
| Stock badge | `status` | `in-stock` бол `Бэлэн`, `out-of-stock` бол `Дууссан`, бусад value бол raw text харагдана. |
| Rating stars | `reviews[].rating` average | Reviews байвал average rating тооцож star харуулна. Байхгүй бол 0. |
| Review count | `reviews.length` | `(0 Сэтгэгдэл)` гэх мэт. |
| Богино тайлбар | `description` | Эхний 100 тэмдэгт + `...`; `Дэлгэрэнгүй` дарахад бүтэн текст. |
| Үнэ | `price` | `formatCurrency(price)` ашиглаж `₮99000.00` хэлбэрээр харуулна. |
| Хямдарсан үнэ | `price`, `discount` | `discount > 0` бол old price + `price - price * discount / 100` шинэ үнэ. |
| Color variation | `imageURLs[].color.name` | Дор хаяж нэг зураг color name-тэй бол бүх imageURLs button болж гарна. |
| Countdown | `offerDate.endDate` | Байвал flash sale timer гарна. Хугацаа өнгөрсөн бол бүх утга 0. |
| Quantity | Redux cart `orderQuantity` | Preview-д local mock state ашиглаж болно. |
| Add to cart | full `productItem` | `out-of-stock` үед disabled. |
| Buy now | static `/cart` link | Одоогоор шууд cart руу шилжинэ. |
| Compare/Wishlist | full `productItem` | `out-of-stock` үед disabled. |
| Ask question | static button | Одоогоор action холбогдоогүй. |
| SKU info | `sku` | Доод query хэсэгт гарна. |
| Category info | `category.name` | Доод query хэсэгт гарна. |
| Tag info | `tags[0]` | Зөвхөн эхний tag харагдана. |

Admin preview шаардлага:

- `description` хоосон эсвэл 100 тэмдэгтээс богино үед preview эвдрэхгүй fallback хэрэгтэй. Одоогийн code `description.substring(...)` ашигладаг тул `description` заавал string байх нь аюулгүй.
- `tags` хоосон байж болох бол `tags[0]`-д fallback гаргах хэрэгтэй.
- `reviews` заавал array байх нь аюулгүй.
- `imageURLs` заавал array байх. Одоогийн color logic `imageURLs.some(...)` гэж шууд дууддаг.

---

## 5. Доод tab хэсгийн mapping

Component: `DetailsTabNav`

| Tab | UI label | Data талбар | Тайлбар |
|---|---|---|---|
| Description | `Тайлбар` | `description` | Бүтээгдэхүүний бүтэн тайлбар дахин харагдана. |
| Additional information | `Нэмэлт мэдээлэл` | `additionalInformation[]` | `key/value` table байдлаар харагдана. |
| Reviews | `Сэтгэгдэл (count)` | `reviews[]` | Review list + review form харагдана. |

`additionalInformation` item:

| Талбар | Утга |
|---|---|
| `key` | Жишээ: `Материал`, `Хэмжээ`, `Баталгаа` |
| `value` | Жишээ: `Cotton`, `M`, `12 сар` |

Review item:

| UI элемент | Data талбар |
|---|---|
| User avatar | `userId.imageURL`; байхгүй бол `userId.name[0]` |
| Rating stars | `rating` |
| User name | `userId.name` |
| Date | `createdAt`, `MMMM D, YYYY` format |
| Comment | `comment` |

Admin preview шаардлага:

- Preview горимд review form-г read-only эсвэл disabled болгож болно. Одоогийн form submit хийхэд login user шалгаад review API дууддаг.
- `reviews` байхгүй бол `[]` болгож normalize хийх.
- `additionalInformation` байхгүй бол хоосон table эсвэл empty state харуулах.

---

## 6. Related products хэсэг

Component: `RelatedProducts`

| UI элемент | Data/API | Тайлбар |
|---|---|---|
| Section pre-title | i18n `productDetails.related.preTitle` | Монгол: `Дараагийн өдрийн бүтээгдэхүүнүүд` |
| Section title | i18n `productDetails.related.title` | Монгол: `Холбоотой бүтээгдэхүүнүүд` |
| Carousel products | `GET /api/product/related-product/:id` | `products.data[]`-г `ProductItem` card болгож харуулна. |

Admin preview-д 2 сонголт байна:

1. Related хэсгийг preview-д нуух.
2. Mock related products array өгч carousel-г харуулах.

Admin preview-ийн гол зорилго нь тухайн product-ийн detail харагдах байдлыг шалгах бол related products-г optional гэж үзэх нь зөв.

---

## 7. Admin form -> Preview field mapping

| Admin form талбар | Product detail дээр харагдах газар | Product object path | Заавал эсэх |
|---|---|---|---|
| Бүтээгдэхүүний нэр | Breadcrumb + title | `title` | Заавал |
| Ангилал | Breadcrumb + top category + bottom info | `category.name` | Заавал |
| Нийлүүлэгч компани | Title-ийн дээр supplier link | `company.name`, `company.slug` | Optional боловч company product-д зөвлөмжтэй |
| SKU | Bottom info | `sku` | Optional |
| Үнэ | Price section | `price` | Заавал |
| Хямдрал хувь | Old/new price | `discount` | Optional, default `0` |
| Нөөцийн төлөв | Stock badge + button disabled | `status` | Заавал, `in-stock` эсвэл `out-of-stock` |
| Богино/үндсэн тайлбар | Right panel + Description tab | `description` | Заавал |
| Зурагнууд | Thumbnail + main image | `imageURLs[].img` | Заавал, дор хаяж 1 |
| Default зураг | Эхний main image | `imageURLs[].isDefault` | Optional, байхгүй бол эхний зураг |
| Өнгө | Color swatches | `imageURLs[].color.name` | Optional |
| Video | Play popup | `videoId` | Optional |
| Tags | Bottom info tag | `tags[0]` | Optional |
| Нэмэлт мэдээлэл | Additional information tab | `additionalInformation[].key/value` | Optional |
| Flash sale дуусах огноо | Countdown | `offerDate.endDate` | Optional |
| Сэтгэгдэл | Rating + reviews tab | `reviews[]` | Preview-д mock/readonly байж болно |

---

## 8. Preview component хийх зөвлөмж

Admin preview-д API-аас product fetch хийхээс илүү form state-ээс preview object үүсгээд product detail-ийн presentational хэсэгт дамжуулах нь тохиромжтой.

Одоогийн `ProductDetailsContent` component нь `productItem` prop авдаг тул Admin талд дараах чиглэлээр ашиглаж болно:

```jsx
<ProductDetailsContent productItem={previewProduct} />
```

Гэхдээ Admin preview дээр дараах behavior-уудыг тусгаарлах хэрэгтэй:

- Add to cart, wishlist, compare, buy now actions-г disabled эсвэл noop болгох.
- Review form submit-г disabled/read-only болгох.
- Related products хэсгийг нуух эсвэл mock data ашиглах.
- Header/Footer-г preview modal дотор заавал оруулахгүй байж болно.

Хэрэв component-г шууд reuse хийх бол `ProductDetailsContent` дээр дараах optional props нэмэх саналтай:

| Prop | Default | Preview mode-д |
|---|---|---|
| `previewMode` | `false` | `true` бол cart/review/navigation side effect-үүдийг disabled болгоно. |
| `showRelatedProducts` | `true` | Admin preview-д `false`. |
| `showReviewForm` | `true` | Admin preview-д `false` эсвэл disabled. |
| `showLayoutSpacing` | `true` | Modal/sidebar preview-д compact болгоход ашиглаж болно. |

---

## 9. Data normalization checklist

Preview object үүсгэхийн өмнө дараах default-уудыг оноовол UI тогтвортой байна.

```js
const previewProduct = {
  _id: form._id || "preview-product",
  sku: form.sku || "-",
  title: form.title || "Бүтээгдэхүүний нэр",
  description: form.description || "Бүтээгдэхүүний тайлбар",
  price: Number(form.price || 0),
  discount: Number(form.discount || 0),
  status: form.status || "in-stock",
  category: {
    name: form.categoryName || "Ангилал"
  },
  company: form.companySlug && form.companyName
    ? { name: form.companyName, slug: form.companySlug }
    : undefined,
  imageURLs: form.images?.length
    ? form.images
    : [{ img: "/assets/img/product/product-1.jpg", isDefault: true }],
  videoId: form.videoId || "",
  tags: form.tags?.length ? form.tags : ["-"],
  offerDate: form.offerEndDate ? { endDate: form.offerEndDate } : undefined,
  additionalInformation: form.additionalInformation || [],
  reviews: form.reviews || []
};
```

---

## 10. Acceptance criteria

1. Admin form дээр нэр, үнэ, зураг, ангилал өөрчлөхөд preview дээр шууд шинэчлэгдэнэ.
2. `discount > 0` үед old price болон хямдарсан шинэ үнэ хоёулаа харагдана.
3. `status = out-of-stock` үед stock badge өөрчлөгдөж cart/wishlist/compare action disabled төлөвтэй байна.
4. Олон зурагтай үед thumbnail дарахад main image солигдоно.
5. Color-той image байвал color swatch хэсэг гарна; color-гүй бол нууж болно.
6. `offerDate.endDate` байвал countdown гарна; байхгүй бол countdown хэсэг гарахгүй.
7. `additionalInformation` key/value rows Additional information tab дээр зөв харагдана.
8. Preview mode-д review submit, cart, wishlist, compare зэрэг real side effect хийх action ажиллахгүй.
9. Required талбар хоосон байсан ч preview page crash хийхгүй fallback утгатай байна.

---

## 11. Одоогийн code дээр анхаарах edge case

Дараах талбарууд байхгүй үед component crash хийх эрсдэлтэй тул Admin preview дээр normalize хийх эсвэл component-д fallback нэмэх хэрэгтэй:

| Талбар | Эрсдэлтэй хэрэглээ | Зөвлөмж |
|---|---|---|
| `description` | `description.substring(0, 100)` | Default empty string эсвэл placeholder оноох. |
| `imageURLs` | `imageURLs.some(...)` | Default `[]` эсвэл placeholder image array оноох. |
| `tags` | `tags[0]` | Default `["-"]` оноох. |
| `reviews` | `reviews.length`, `reviews.reduce(...)` | Default `[]` оноох. |
| `category` | `product.category.name` breadcrumb дээр | Default `{ name: "Ангилал" }` оноох. |
| `userId.name` review дээр | `userId?.name[0]` | Review mock-д `userId.name` заавал өгөх. |

