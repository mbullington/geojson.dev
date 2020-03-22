import * as React from "react";
import "./Actions.css";
import { saveAs } from "file-saver";
import geojsonhint from "@mapbox/geojsonhint";
import { ShareModal } from "./ShareModal";

export function Actions({
  parsed,
  onGeojson
}: {
  parsed: any;
  onGeojson: (p: any) => void;
}) {
  const onOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.click();
    input.addEventListener(
      "change",
      async e => {
        if (input.files === null) {
          return;
        }
        const file = input.files[0];
        const text = await (file as any).text();
        try {
          const parsed = JSON.parse(text);
          const errors = geojsonhint.hint(parsed);
          if (errors.length) {
            throw new Error("Invalid geojson");
          }
          onGeojson(text);
        } catch (e) {
          console.error("Failed", e);
        }
      },
      false
    );
  };

  const onSave = () => {
    const blob = new Blob([JSON.stringify(parsed, null, 2)], {
      type: "application/json;charset=utf-8"
    });
    saveAs(blob, "geometry.json");
  };

  const [shareModal, setShareModal] = React.useState(false);

  return (
    <div className="Actions">
      <button className="Actions__action" onClick={onOpen}>
        Open
      </button>
      <button className="Actions__action" onClick={onSave}>
        Download
      </button>
      <button
        className="Actions__action"
        onClick={() => setShareModal(x => !x)}
      >
        Share
      </button>
      {shareModal && <ShareModal parsed={parsed} />}
    </div>
  );
}
