import { FC, ReactNode } from "react"
import { Text } from "../../components/Text"
import { blueDark, crimsonDark, indigoDark, redDark } from "@radix-ui/colors"
import {
  cyanDark,
  greenDark,
  pinkDark,
  plumDark,
  purpleDark,
  tealDark,
  violetDark,
} from "@radix-ui/colors"

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min
const shuffle = (arr: any[]) => [...arr].sort(() => 0.5 - Math.random())

interface Props {
  children: ReactNode
  duration: number
  reverse: boolean
}

const InfiniteLoopSlider: FC<Props> = ({
  children,
  duration,
  reverse = false,
}) => {
  return (
    <div
      className="loop-slider"
      style={
        {
          "--duration": `${duration}ms`,
          "--direction": reverse ? "reverse" : "normal",
        } as any
      }
      suppressHydrationWarning
    >
      <div className="keyword-slider-row ">
        {children}
        {children}
      </div>
    </div>
  )
}

const Tag = ({
  text,
  colors,
}: {
  text: string
  colors: readonly [string, string, string]
}) => (
  <div
    className="flex items-center justify-center px-6 py-2 mr-2 transition duration-1000 border rounded-full select-none whitespace-nowrap hover:transition-none hover:brightness-200"
    style={{
      background: colors[0],
      borderColor: colors[1],
    }}
    suppressHydrationWarning
  >
    <Text
      suppressHydrationWarning
      as="span"
      weight="medium"
      style={{
        color: colors[2],
      }}
    >
      {text}
    </Text>
  </div>
)

export const KeywordSlider = ({
  rows = 5,
  tagsPerRow = 10,
  duration = [40000, 50000],
}: {
  rows?: number
  tagsPerRow?: number
  duration?: [number, number]
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative flex flex-col w-full overflow-hidden shrink-0 gap-y-2"
        suppressHydrationWarning
      >
        {[...new Array(rows)].map((_, i) => (
          <InfiniteLoopSlider
            key={i}
            duration={random(...duration)}
            reverse={Boolean(i % 2)}
          >
            {shuffle(TAGS)
              .slice(0, tagsPerRow)
              .map(tag => {
                const tagIndex = TAGS.indexOf(tag)
                const colors = COLORS[(tagIndex + i) % COLORS.length]

                return <Tag colors={colors} text={tag} key={tag} />
              })}
          </InfiniteLoopSlider>
        ))}
        <div className="fade" />
      </div>
    </div>
  )
}

const COLORS = [
  [redDark.red2, redDark.red7, redDark.red11],
  [crimsonDark.crimson2, crimsonDark.crimson7, crimsonDark.crimson11],
  [pinkDark.pink2, pinkDark.pink7, pinkDark.pink11],
  [plumDark.plum2, plumDark.plum7, plumDark.plum11],
  [purpleDark.purple2, purpleDark.purple7, purpleDark.purple11],
  [violetDark.violet2, violetDark.violet7, violetDark.violet11],
  [indigoDark.indigo2, indigoDark.indigo7, indigoDark.indigo11],
  [blueDark.blue2, blueDark.blue7, blueDark.blue11],
  [cyanDark.cyan2, cyanDark.cyan7, cyanDark.cyan11],
  [tealDark.teal2, tealDark.teal7, tealDark.teal11],
  [greenDark.green2, greenDark.green7, greenDark.green11],
] as const

const TAGS = [
  "HTML",
  "CSS",
  "JavaScript",
  "jQuery",
  "Bootstrap",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "REST",
  "SOAP",
  "GraphQL",
  "Webpack",
  "Babel",
  "TypeScript",
  "ES6",
  "JSON",
  "XML",
  "AJAX",
  "HTTP",
  "HTTPS",
  "SSL",
  "TLS",
  "FTP",
  "DNS",
  "IP",
  "Domain",
  "URL",
  "URI",
  "CDN",
  "API",
  "OAuth",
  "JWT",
  "CORS",
  "SASS",
  "LESS",
  "Gulp",
  "Grunt",
  "WebSockets",
  "WebRTC",
  "WebAssembly",
  "Service Workers",
  "Progressive Web Apps",
  "Push Notifications",
  "Geolocation",
  "Web Storage",
  "IndexedDB",
  "Web Audio API",
  "WebGL",
  "Canvas",
  "SVG",
  "Web VR",
  "Web AR",
  "Web Accessibility",
  "Meth cooking",
  "ARIA",
  "WCAG",
  "Section 508",
  "WAI",
  "Semantic HTML",
  "Microformats",
  "Schema.org",
  "OpenGraph",
  "Twitter Cards",
  "AMP",
  "PWA",
  "Serverless",
  "Firebase",
  "AWS Lambda",
  "Azure Functions",
  "Netlify",
  "Heroku",
  "DigitalOcean",
  "Cloudflare",
  "Akamai",
  "Docker",
  "Kubernetes",
  "Continuous Integration",
  "Continuous Deployment",
  "DevOps",
  "Agile",
  "Scrum",
  "Kanban",
]
