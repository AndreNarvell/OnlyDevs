import { Text } from "../../../components/Text"
import { recursiveObjectRenderer } from "../../../utils/recuresiveObjectRenderer"
import { EditorDetails, EditorModule } from "../stores/editorContent"
import { DocumentTextIcon, FilmIcon } from "@heroicons/react/24/outline"
import { FC } from "react"

interface Props {
  details?: EditorDetails
  curriculum?: EditorModule[]
}

const TEXT_SIZE = "sm"

export const PublishSummary: FC<Props> = ({ details, curriculum }) => {
  if (!details) return null

  return (
    <div>
      <>
        {recursiveObjectRenderer(details)}

        {curriculum && (
          <div className="mb-2">
            <Text as="h6" intent="primary" size={TEXT_SIZE}>
              Curriculum
            </Text>

            <Text as="p" intent="secondary" size={TEXT_SIZE}>
              {curriculum.length} modules
            </Text>

            <Text as="p" intent="secondary" size={TEXT_SIZE} className="mb-2">
              {curriculum.reduce(
                (acc, module) => acc + module.lessons.length,
                0
              )}{" "}
              lessons
            </Text>

            <ul className="mb-2">
              {curriculum.map(module => (
                <li className="leading-none" key={module.id}>
                  <Text
                    as="span"
                    display="inline"
                    size={TEXT_SIZE}
                    className="capitalize"
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
                          className="flex items-center gap-x-1"
                        >
                          {lesson.content_type === "video" ? (
                            <FilmIcon className="w-4 h-4" />
                          ) : (
                            <DocumentTextIcon className="w-4 h-4" />
                          )}
                          {lesson.title}

                          <span className="text-success">
                            {lesson.content_type === "article" &&
                              "(" + lesson.article_data?.length + " chars)"}
                          </span>

                          {lesson.content_type === "video" &&
                            !lesson.video_url && (
                              <span className="text-error">{"(no video)"}</span>
                            )}

                          {lesson.content_type === "article" &&
                            (!lesson.article_data ||
                              lesson.article_data === "<p></p>") && (
                              <span className="text-error">
                                {"(no text content)"}
                              </span>
                            )}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    </div>
  )
}
