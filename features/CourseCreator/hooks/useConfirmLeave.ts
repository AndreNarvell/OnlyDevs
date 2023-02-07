import { useBeforeUnload } from "../../../hooks/useBeforeUnload"
import { useEditorContent } from "../stores/editorContent"

export const useConfirmLeave = () => {
  const isDirty = useEditorContent(state => state.isDirty)

  useBeforeUnload(
    isDirty,
    "You have unsaved changes. Are you sure you want to leave?"
  )
}
