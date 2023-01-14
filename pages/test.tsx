import { KeywordSlider } from "../features/IndexPage/KeywordSlider"

const Test = () => {
  return (
    <>
      <KeywordSlider rows={20} duration={[50000, 500000]} />

      <div className="container py-64"></div>
    </>
  )
}

export default Test
