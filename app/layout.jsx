import '../src/index.css'
import '../src/App.css'
import '../src/Admin.css'
import '../src/MenuPage.css'

export const metadata = {
  title: { default: 'MARÉ — Atlantic Seafood, Agadir', template: '%s | MARÉ' },
  description: "Seafood and coastal dining on Morocco's Atlantic coast.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
  },
}

export const viewport = { themeColor: '#071A20', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>
}
