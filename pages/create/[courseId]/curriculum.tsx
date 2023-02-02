import { Meta } from "../../../components/Meta"
import { CourseCreatorLayout } from "../../../components/layouts/CourseCreatorLayout"
import { CurriculumEditor } from "../../../features/CourseCreator/components/CurriculumEditor"
import { CurriculumModule } from "../../../features/CourseCreator/components/CurriculumModule"
import { useNoLoadedCourse } from "../../../features/CourseCreator/hooks/useNoLoadedCourse"
import { useEditorContent } from "../../../features/CourseCreator/stores/editorContent"
import { ChevronUpDownIcon } from "@heroicons/react/24/outline"
import * as Accordion from "@radix-ui/react-accordion"
import { Reorder, useDragControls } from "framer-motion"
import { useRouter } from "next/router"

const CurriculumPage = () => {
  useNoLoadedCourse()

  const { query, push } = useRouter()

  const [curriculum, setCurriculum] = useEditorContent(state => [
    state.curriculum,
    state.setCurriculum,
  ])

  return (
    <>
      <Meta title="Course creator" />

      <CourseCreatorLayout wide>
        <div className="grid grid-cols-3 gap-x-8">
          <aside className="col-span-1 p-6 border w-96 shrink-0 rounded-marketing border-accents-2">
            {curriculum && (
              <Accordion.Root type="multiple">
                <Reorder.Group
                  values={curriculum}
                  onReorder={setCurriculum}
                  className="flex flex-col gap-y-2"
                >
                  {curriculum?.map((module, index) => (
                    <CurriculumModule module={module} key={module.id} />
                  ))}
                </Reorder.Group>
              </Accordion.Root>
            )}
          </aside>

          <CurriculumEditor />
        </div>
      </CourseCreatorLayout>
    </>
  )
}

export default CurriculumPage
