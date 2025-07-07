import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

interface EditorComponentProps {
  value: string;
  onChange: (data: string) => void;
}
export default function EditorComponent({
  value,
  onChange,
}: EditorComponentProps) {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        toolbar: {
          items: ["undo", "redo", "|", "bold", "italic"],
        },
        plugins: [Bold, Essentials, Italic, Mention, Paragraph, Undo],
      }}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}
