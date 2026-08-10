import './globals.scss';
import {Jost, Roboto,Charm,Oregano} from 'next/font/google';
import Providers from '@/components/provider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Snuu онлайн дэлгүүр',
    template: '%s | Snuu онлайн дэлгүүр',
  },
  description: 'Snuu онлайн дэлгүүр',
  icons: {
    icon: [
      { url: '/assets/img/logo/snu_logo.png', type: 'image/png' },
      { url: '/assets/img/logo/favicon.png', sizes: '34x32', type: 'image/png' },
    ],
    shortcut: '/assets/img/logo/snu_logo.png',
    apple: '/assets/img/logo/snu_logo.png',
  },
  openGraph: {
    title: 'Snuu онлайн дэлгүүр',
    description: 'Snuu онлайн дэлгүүр',
    siteName: 'Snuu онлайн дэлгүүр',
    images: [
      {
        url: '/assets/img/logo/snu_logo_comp.png',
        width: 1536,
        height: 864,
        alt: 'Snuu онлайн дэлгүүр',
      },
    ],
    locale: 'mn_MN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snuu онлайн дэлгүүр',
    description: 'Snuu онлайн дэлгүүр',
    images: ['/assets/img/logo/snu_logo_comp.png'],
  },
}

const body = Jost({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-body",
});
const heading = Jost({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-heading",
});
const p = Jost({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-p",
});
const jost = Jost({
  weight: ["300","400", "500", "600", "700", "800","900"],
  subsets: ["latin"],
  variable: "--tp-ff-jost",
});
const roboto = Roboto({
  weight: ["300","400","500","700","900"],
  subsets: ["latin"],
  variable: "--tp-ff-roboto",
});
const oregano = Oregano({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--tp-ff-oregano",
});
const charm = Charm({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--tp-ff-charm",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${body.variable} ${heading.variable} ${p.variable} ${jost.variable} ${roboto.variable} ${oregano.variable} ${charm.variable}`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
