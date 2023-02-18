import { useState, useRef } from "react";

import { dbSaveUrls } from "../firebase/firebase";

function ParseAndAddNotes() {
  const [urls, setUrls] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const saveUrls = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dbSaveUrls(urls.split(",")).then(() => {
      setUrls("");
      inputRef.current?.focus();
    });
  };

  const onUrlsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUrls = event.target.value
      .split(",")
      .map((urlItem) => urlItem.trim())
      .filter(Boolean);

    const urlsSet = new Set(newUrls);

    setUrls(Array.from(urlsSet).join(","));
  };

  return (
    <div>
      <h2>Agregar notas</h2>
      <div>
        <form onSubmit={saveUrls}>
          <input
            ref={inputRef}
            type="text  "
            value={urls}
            onChange={onUrlsChange}
          />
          <button type="submit">Guardar</button>
        </form>
        <ol>
          {urls.split(",").length > 0 &&
            urls.split(",").map((urlItem) => <li key={urlItem}>{urlItem}</li>)}
        </ol>
      </div>
    </div>
  );
}

export default ParseAndAddNotes;
