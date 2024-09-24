import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEdgeStore } from "@/lib/edgestore";

import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import { useMemo, useCallback, useRef } from "react";

export default function Editor({ onChange, initialContent, editable }: any) {
  const lastSaveTimeRef = useRef(Date.now());
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });
    return response.url;
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });

  const debouncedSave = useCallback((s: string) => {
    const currentTime = Date.now();
    if (currentTime - lastSaveTimeRef.current >= 1000) {
      console.log(editor.document, "saving");
      onChange(s);
      lastSaveTimeRef.current = currentTime;
    }
  }, []);

  if (editor === undefined) {
    return "Loading content...";
  }

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={() => {
        debouncedSave(JSON.stringify(editor.document, null, 2));
      }}
    />
  );
}
