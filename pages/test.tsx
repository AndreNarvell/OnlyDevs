import { Button } from "../components/Button"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

const Test = () => {
  const editor = useEditor({
    editable: true,
    content: "",
    extensions: [StarterKit],
  })

  return (
    <>
      {/* <KeywordSlider rows={20} duration={[50000, 500000]} /> */}

      <div className="container py-64">
        <EditorContent
          editor={editor}
          className="p-4 border border-accents-3 rounded-base"
        />

        <Button
          className="my-4"
          onClick={() => {
            editor && navigator.clipboard.writeText(editor.getHTML())
          }}
        >
          Copy
        </Button>

        <pre>{editor?.getHTML()}</pre>
      </div>
    </>
  )
}

export default Test
