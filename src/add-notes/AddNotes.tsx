import { useState } from "react";

import { dbSaveUrls } from "../firebase/firebase";

function AddNotes() {
  const [urls, setUrls] = useState<string[]>(["", "", ""]);

  const updateUrl = (newUrl: string, index: number) => {
    setUrls((prev) => {
      const newUrls = [...prev];
      newUrls[index] = newUrl;
      return newUrls;
    });
  };

  const addUrl = () => {
    setUrls((prev) => {
      const newUrls = [...prev, ""];
      return newUrls;
    });
  };

  const saveUrls = () => {
    dbSaveUrls(urls).then(() => {
      setUrls(["", "", ""]);
    });
  };

  return (
    <div>
      <h2>Agregar notas</h2>
      <div>
        {urls.map((urlItem, index) => (
          <input
            key={index}
            type="email"
            value={urlItem}
            onChange={(event) => updateUrl(event.target.value, index)}
          />
        ))}
        <button onClick={addUrl}>+</button>
      </div>
      <div>
        <button onClick={saveUrls}>Guardar</button>
      </div>
    </div>
  );
}

export default AddNotes;
