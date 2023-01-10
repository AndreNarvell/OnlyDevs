import Link from "next/link"
import { Logo } from "./Logo"
import { Text } from "./Text"

const links = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
]

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center px-6 py-8 border-t bg-accents-1 border-accents-2 gap-y-8">
      <nav>
        <ul className="flex gap-x-6">
          {links.map(link => (
            <li key={link.name}>
              <Link href={link.href}>
                <Text
                  weight="medium"
                  tracking="wide"
                  className="transition duration-300 hover:text-accents-6 hover:transition-none"
                >
                  {link.name}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <hr className="w-full border-accents-2" />
      <Link href="/">
        <Logo />
      </Link>

      <Text size="sm" intent="secondary">
        Copyright &copy; 2023 OnlyDevs
      </Text>
    </footer>
  )
}
