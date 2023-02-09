import { Meta } from "../../../components/Meta"
import { UnavailableOnMobile } from "../../../components/UnavailableOnMobile"
import { CourseCreatorLayout } from "../../../components/layouts/CourseCreatorLayout"
import { CurriculumEditor } from "../../../features/CourseCreator/components/CurriculumEditor"
import { CurriculumModule } from "../../../features/CourseCreator/components/CurriculumModule"
import { useConfirmLeave } from "../../../features/CourseCreator/hooks/useConfirmLeave"
import { useLoadCourse } from "../../../features/CourseCreator/hooks/useLoadCourse"
import { useEditorContent } from "../../../features/CourseCreator/stores/editorContent"
import { getCourseCreatorData } from "../../../models/courses"
import { CourseStructure } from "../../../types/Course"
import { protectRoute } from "../../../utils/protectRoute"
import * as Accordion from "@radix-ui/react-accordion"
import { Reorder } from "framer-motion"
import { GetServerSideProps, NextPage } from "next"

interface Props {
  course: CourseStructure
}

const CurriculumPage: NextPage<Props> = ({ course }) => {
  useLoadCourse(course)
  useConfirmLeave()

  const [curriculum, setCurriculum] = useEditorContent(state => [
    state.curriculum,
    state.setCurriculum,
  ])

  return (
    <>
      <Meta title="Course creator" />

      <UnavailableOnMobile />

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
                  {curriculum?.map(module => (
                    <CurriculumModule module={module} key={module.id} />
                  ))}

                  <button
                    onClick={() => {
                      // Add a module to the end of the array
                      if (!curriculum) return

                      setCurriculum([
                        ...curriculum,
                        {
                          id: crypto.randomUUID(),
                          title: "New module",
                          lessons: [],
                          sort_order: -1,
                        },
                      ])
                    }}
                    className="mb-2 text-sm transition hover:text-foreground ml-7 text-secondary hover:transition-none w-max"
                  >
                    Add a module +
                  </button>
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

export const getServerSideProps: GetServerSideProps = async ctx => {
  const auth = await protectRoute(ctx, "/dashboard")
  if (!auth.isAuthed) {
    return auth.redirect
  }

  const courseId = ctx.query?.courseId
  if (typeof courseId !== "string") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    }
  }

  const course = await getCourseCreatorData(courseId)
  if (!course) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      course,
    },
  }
}
