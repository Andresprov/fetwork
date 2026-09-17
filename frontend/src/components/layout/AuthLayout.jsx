import Header from './Header'
import Footer from './Footer'

export default function AuthLayout({ children }) {
  return (
    <div className="bg-background font-sans text-on-surface antialiased min-h-screen flex flex-col justify-between">
      <Header />
      <main className="w-full pt-16 flex-1 flex flex-col justify-center items-center px-gutter-mobile lg:px-gutter-desktop py-space-xl bg-background">
        {children}
      </main>
      <Footer />
    </div>
  )
}
