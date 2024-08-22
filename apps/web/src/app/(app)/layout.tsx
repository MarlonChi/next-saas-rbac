import { Header } from '@/components/header'

export default async function AuthLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  //   if (isAuthenticated()) {
  //     redirect('/auth/sign-in')
  //   }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
