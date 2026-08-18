# Google OAuth Setup

`Error 401: invalid_client` эсвэл `The OAuth client was not found` алдаа гарвал frontend дээр ашиглаж байгаа Google Client ID буруу, устсан, эсвэл placeholder хэвээр байна гэсэн үг.

## 1. Local env шалгах

`.env.local` дээр:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
NEXT_PUBLIC_API_BASE_URL=http://localhost:7001
```

Одоогийн placeholder утга ажиллахгүй:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your google client id
```

## 2. Google Cloud Console тохиргоо

Google Cloud Console дээр OAuth Client үүсгэхдээ:

- Application type: `Web application`
- Authorized JavaScript origins:
  - Local: `http://localhost:3000`
  - Production: `https://your-frontend-domain.com`

`@react-oauth/google` ашиглаж байгаа тул frontend-д **Web client ID** хэрэгтэй. Android/iOS/Desktop client ID тавибал browser login ажиллахгүй.

## 3. Vercel дээр

Vercel Project Settings -> Environment Variables:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

Env сольсны дараа заавал redeploy хийнэ.

## 4. Backend шалгах

Google popup амжилттай credential буцаасны дараа frontend дараах endpoint руу илгээнэ:

```text
POST api/user/register/:googleCredentialToken
```

Тиймээс backend тал Google token verify хийдэг client ID нь frontend-ийн `NEXT_PUBLIC_GOOGLE_CLIENT_ID`-тай нэг project/client-д нийцэж байгаа эсэхийг шалгана.

