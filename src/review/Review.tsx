import { useState, useEffect } from "react";

import { dbGetNotesUrl } from "../firebase/firebase";
import {
  NoteInfoFieldsType,
  NoteType,
  noteInfoFields,
} from "../firebase/types";

import ReviewActionBar from "./ReviewActionBar";
import "./Review.css";

function Review() {
  const [noteField, setNoteField] = useState<NoteInfoFieldsType>("ageRange");
  const [data, setData] = useState<NoteType[] | null>(null);
  const [noteIndex, setNoteIndex] = useState(0);
  const [urlIndex, setUrlIndex] = useState(0);

  useEffect(() => {
    dbGetNotesUrl(noteField).then((res) => {
      setNoteIndex(0);
      setUrlIndex(0);
      setData(res);
    });
  }, [noteField]);

  const fieldsSelector = () => (
    <div>
      Campo:
      <select
        value={noteField}
        onChange={(event) =>
          setNoteField(event.target.value as NoteInfoFieldsType)
        }
      >
        {[...noteInfoFields].sort().map((fieldName) => (
          <option key={fieldName} value={fieldName}>
            {fieldName}
          </option>
        ))}
      </select>
    </div>
  );

  const nextNote = () => {
    setNoteIndex((prev) => prev + 1);
    setUrlIndex(0);
  };

  if (!data) return <h1>Cargando info</h1>;
  if (data?.length === 0 || noteIndex >= data.length)
    return (
      <div>
        <h1>Todo lleno para este campo</h1>
        {fieldsSelector()}
      </div>
    );

  const note = data[noteIndex];

  return (
    <div>
      <h2>Ver notas</h2>
      <div>{fieldsSelector()}</div>
      {/* <div> */}
      {/* TODO show previous data */}
      {/* {data && JSON.stringify(note)} */}
      {/* </div> */}
      <div>
        <div className="bar">
          <ReviewActionBar
            field={noteField}
            noteId={note.id}
            nextNote={nextNote}
          />
          <div>
            {note?.urls?.length <= 1 ? null : (
              <fieldset>
                <legend>Urls:</legend>
                {note.urls.map((urlItem, index) => (
                  <label>
                    <input
                      key={urlItem}
                      name="urls"
                      type="radio"
                      value={index}
                      onChange={(event) =>
                        setUrlIndex(parseInt(event.target.value))
                      }
                      checked={urlIndex === index}
                    />
                    {new URL(urlItem)?.host}
                  </label>
                ))}
              </fieldset>
            )}
            <div>
              <a href={note.urls[urlIndex]} target="_blank" rel="noreferrer">
                {" "}
                En caso de que no se vea, aquí la nota original
              </a>
            </div>
          </div>
        </div>
        <div className="iframeContainer">
          <iframe
            sandbox="true"
            width="99%"
            height="100%"
            title="noticia"
            src={note.urls[urlIndex]}
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Review;
