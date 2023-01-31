import { Meta } from "../../../../components/Meta"
import { CourseCreatorLayout } from "../../../../components/layouts/CourseCreatorLayout"
import { useNoLoadedCourse } from "../../../../features/CourseCreator/hooks/useNoLoadedCourse"

const CreatePage = () => {
  useNoLoadedCourse()

  return (
    <>
      <Meta title="Course creator" />

      <CourseCreatorLayout></CourseCreatorLayout>
    </>
  )
}
export default CreatePage
