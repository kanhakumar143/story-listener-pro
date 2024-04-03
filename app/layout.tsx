import SideBar from '@/components/Sidebar'
import './globals.css'
import { Figtree } from 'next/font/google'
import SupabaseProvider from '@/providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import ModalProvider from '@/providers/ModalProvider'
import ToasterProvider from '@/providers/ToasterProvider'
import getSongsById from '@/actions/getSongsByUserId'
import Player from '@/components/Player'
import getActiveProductWithPrice from '@/actions/getActiveProductWithPrice'
import { Metadata } from 'next'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "Story Listener Pro",
    template: "Story Listener Pro | %s"
  },
  description: 'Listen to story!',
}

export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const userSongs = await getSongsById();
  const products = await getActiveProductWithPrice();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider products={products} />
            <SideBar songs={userSongs}>
              {children}
            </SideBar>
            <Player />
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
