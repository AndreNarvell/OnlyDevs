import { Button } from "../../../components/Button"
import { Input } from "../../../components/Input"
import { Text } from "../../../components/Text"
import { plusJakartaSans } from "../../../pages/_app"
import { EditorModule, useEditorContent } from "../stores/editorContent"
import { CurriculumLesson } from "./CurriculumLesson"
import { Dialog } from "@headlessui/react"
import { ChevronRightIcon } from "@heroicons/react/20/solid"
import { ChevronUpDownIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import * as Accordion from "@radix-ui/react-accordion"
import { Reorder, useDragControls } from "framer-motion"
import { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface Props {
  module: EditorModule
}

const newNameFormSchema = z.object({
  name: z.string().min(2).max(50),
})

interface NewNameForm {
  name: string
}

export const CurriculumModule: FC<Props> = ({ module }) => {
  const controls = useDragControls()
  const [isOpen, setIsOpen] = useState(false)

  const [curriculum, setCurriculum] = useEditorContent(state => [
    state.curriculum,
    state.setCurriculum,
  ])

  const { register, handleSubmit } = useForm<NewNameForm>({
    defaultValues: { name: module.title },
    resolver: zodResolver(newNameFormSchema),
  })

  const renameModule = (moduleId: string, newTitle: string) => {
    if (!curriculum) return

    const newCurriculum = [...curriculum]
    const moduleIndex = newCurriculum.findIndex(
      module => module.id === moduleId
    )

    newCurriculum[moduleIndex].title = newTitle

    setCurriculum(newCurriculum)
  }

  const onSubmit = ({ name }: NewNameForm) => {
    renameModule(module.id, name)
    setIsOpen(false)
  }

  const reorderLessons = (newOrder: any[]) => {
    if (!curriculum) return

    const newCurriculum = [...curriculum]
    const moduleIndex = newCurriculum.findIndex(
      moduleInArray => moduleInArray.id === module.id
    )

    newCurriculum[moduleIndex].lessons = newOrder
    setCurriculum(newCurriculum)
  }

  return (
    <>
      <Accordion.Item value={module.id} key={module.id}>
        <Reorder.Item
          value={module}
          dragListener={false}
          dragControls={controls}
          className="flex flex-col select-none"
        >
          <div className="flex gap-x-1">
            <ChevronUpDownIcon
              onPointerDown={e => {
                controls.start(e)
              }}
              className="w-6 h-6 shrink-0 text-secondary"
            />

            <Accordion.Header>
              <Accordion.Trigger className="flex text-sm text-left gap-x-1 curriculum-accordion-header">
                {module.title}

                <ChevronRightIcon className="w-5 mt-px transition duration-100 h-5 shrink-0 text-secondary  data-[state=open]:bg-error" />
              </Accordion.Trigger>
            </Accordion.Header>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="text-xs transition ml-7 text-secondary w-max hover:text-foreground"
          >
            Edit name
          </button>

          <Accordion.Content
            id="1234"
            className="overflow-hidden data-[state=open]:animate-[slideDown_300ms_ease-out] data-[state=closed]:animate-[slideUp_300ms_ease-out] mt-3"
          >
            <Reorder.Group onReorder={reorderLessons} values={module.lessons}>
              {module.lessons.map(lesson => (
                <CurriculumLesson lesson={lesson} key={lesson.id} />
              ))}
            </Reorder.Group>
          </Accordion.Content>
        </Reorder.Item>
      </Accordion.Item>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className={plusJakartaSans.className}
      >
        <Dialog.Overlay className="fixed inset-0 w-full h-full bg-black/50" />

        <Dialog.Panel className="fixed flex flex-col items-center p-8 -translate-x-1/2 -translate-y-1/2 border bg-accents-1 border-accents-2 rounded-base top-1/2 left-1/2">
          <Dialog.Title as={Text} size="xl" weight="bold">
            Rename module
          </Dialog.Title>
          <Dialog.Description as={Text} intent="secondary" className="mb-4">
            Enter a new name for the module
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="dialog-name-input"
              label="New name"
              className="mb-4"
              inputClassName="w-96"
              {...register("name")}
            />

            <div className="flex justify-center gap-x-2">
              <Button type="submit">Rename</Button>
              <Button
                type="button"
                intent="secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  )
}
