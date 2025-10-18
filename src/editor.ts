import { EditorView, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, history } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";

import { markdownTheme } from "./theme";
import { smartLineWrapping } from "./line-wrap";
import { widgets } from "./widgets";
import { autocomplete } from "./autocomplete";
import { isInFencedCodeBlock } from "./common";

export function attachedEditorView(
  parent: HTMLElement,
  submitCallback: (_: string) => void,
  initialText: string,
  placeholderText: string,
): EditorView {
  const enterKeymap = keymap.of([
    {
      key: "Enter",
      run: (view) => {
        const cursor = view.state.selection.main;
        if (!isInFencedCodeBlock(view.state, cursor.from, cursor.to)) {
          submitCallback(view.state.doc.toString());
          return true;
        } else {
          return false;
        }
      },
    },
  ]);

  return new EditorView({
    parent,
    state: EditorState.create({
      doc: initialText,
      extensions: [
        enterKeymap,
        // Note: required for atomic ranges to work:
        // https://github.com/codemirror/dev/issues/923
        keymap.of(defaultKeymap),
        history(),
        markdown({ base: markdownLanguage }),
        smartLineWrapping,
        placeholder(placeholderText),
        autocomplete(),
        widgets,
        markdownTheme,

        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            parent.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }),
      ],
    }),
  });
}
