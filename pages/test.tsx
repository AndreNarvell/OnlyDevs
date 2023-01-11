import { KeywordSlider } from "../features/IndexPage/KeywordSlider"
import { HeroText } from "../features/IndexPage/HeroText"

const Test = () => {
  return (
    <>
      <KeywordSlider rows={20} duration={[50000, 500000]} />

      <div className="relative">
        <KeywordSlider rows={20} duration={[50000, 500000]} />

        <div
          className="absolute py-16 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-background rounded-marketing"
          style={{
            boxShadow: "0 0 64px 32px #000a",
            animation: "twinkle 2s infinite 2s",
          }}
        >
          <HeroText />
        </div>
      </div>
    </>
  )
}

export default Test
