import { KeywordSlider } from "../features/IndexPage/KeywordSlider"
import { useState } from "react"
import { FilterItem } from "../features/CoursesPage/components/MobileFilterMenu"

const Test = () => {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)

  return (
    <>
      <KeywordSlider rows={20} duration={[50000, 500000]} />

      <div className="container py-64">
        <FilterItem
          name="asd"
          formPrefix="asd"
          id="asd"
          label="asd"
          checked={checked1}
          onChange={e => setChecked1(e.target.checked)}
        />
        <FilterItem
          name="1asd"
          formPrefix="asd"
          id="1asd"
          label="asd"
          checked={checked2}
          onChange={e => setChecked2(e.target.checked)}
        />
        <FilterItem
          name="a2sd"
          formPrefix="asd"
          id="a2sd"
          label="asd"
          checked={checked3}
          onChange={e => setChecked3(e.target.checked)}
        />
      </div>
    </>
  )
}

export default Test
