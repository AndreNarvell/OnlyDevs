import { Text } from "../../../components/Text"
import { formatPrice } from "../../../utils/formatPrice"
import { EditorDetails, EditorModule } from "../stores/editorContent"
import { FC, ReactElement } from "react"

interface Props {
  details?: EditorDetails
  curriculum?: EditorModule[]
}

const TEXT_SIZE = "xs"

export const PublishSummary: FC<Props> = ({ details, curriculum }) => {
  if (!details) return null

  return (
    <div>
      {Object.entries(details).map(([key, value]) => {
        let Component: ReactElement = <div />

        switch (typeof value) {
          case "string": {
            Component = (
              <Text as="p" intent="secondary" size={TEXT_SIZE}>
                {value}
              </Text>
            )
            break
          }
          case "number": {
            Component = (
              <Text as="p" intent="secondary" size={TEXT_SIZE}>
                {key.includes("price") ? formatPrice(value) : value}
              </Text>
            )
            break
          }

          case "object": {
            if (Array.isArray(value)) {
              Component = (
                <ul className="list-inside">
                  {value.map(item => (
                    <li
                      className="list-disc marker:content-['-'] leading-none marker:text-xs marker:text-secondary "
                      key={item}
                    >
                      <Text
                        as="span"
                        display="inline"
                        intent="secondary"
                        size={TEXT_SIZE}
                      >
                        {item}
                      </Text>
                    </li>
                  ))}
                </ul>
              )
            }
            break
          }
        }

        return (
          <div className="mb-2" key={key}>
            <Text
              as="h6"
              intent="primary"
              size={TEXT_SIZE}
              className="capitalize"
            >
              {key}
            </Text>

            {Component}
          </div>
        )
      })}

      {curriculum && (
        <div className="mb-2">
          <Text as="h6" intent="primary" size={TEXT_SIZE}>
            Curriculum
          </Text>

          <Text as="p" intent="secondary" size={TEXT_SIZE}>
            {curriculum.length} modules
          </Text>

          <Text as="p" intent="secondary" size={TEXT_SIZE} className="mb-2">
            {curriculum.reduce((acc, module) => acc + module.lessons.length, 0)}{" "}
            lessons
          </Text>

          <ul className="mb-2">
            {curriculum.map(module => (
              <li className="leading-none" key={module.id}>
                <Text
                  as="span"
                  display="inline"
                  intent="secondary"
                  size={TEXT_SIZE}
                >
                  {module.title}
                </Text>

                <ul className="ml-4">
                  {module.lessons.map(lesson => (
                    <li className="leading-none" key={lesson.id}>
                      <Text
                        as="span"
                        display="inline"
                        intent="secondary"
                        size={TEXT_SIZE}
                      >
                        {lesson.title}
                      </Text>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
