import { useState } from "react";

import type { NoteInfo, NoteInfoFieldsType } from "../firebase/types";
import { dbUpdateNoteField } from "../firebase/firebase";



const SEX_OPTIONS = ["hombre", "mujer"] as const;

const AGE_OPTIONS = ["niño", "joven", "adulto", "viejo"] as const;

const TRANSPORT_OPTIONS = ['motocicleta', 'peaton','coche', 'bicicleta']

type OmitButtonProps = {
  onOmit: () => void;
};
const OmitButton = ({ onOmit }: OmitButtonProps) => (
  <button onClick={onOmit}>Omitir</button>
);

type AgeProps = {
  noteId: string;
  onFilled: () => void;
  onOmit: () => void;
};

const Age = ({ noteId, onFilled, onOmit }: AgeProps) => {
  const [victimAge, setVictimAge] = useState(0);

  const handleAgeCategoryUpdate = (newAgeRange: NoteInfo["ageRange"]) => {
    dbUpdateNoteField(noteId, "sex", newAgeRange).then(onFilled);
  };

  const handleAgeNumberUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isNaN(victimAge) || victimAge <= 0) return;

    dbUpdateNoteField(noteId, "ageRange", victimAge.toString()).then(onFilled);
  };

  return (
    <>
      <div>
        <div>Edad en años</div>
      </div>
      <form onSubmit={handleAgeNumberUpdate}>
        <label htmlFor="victim-age">Edad (años)</label>
        <input
          id="victim-age"
          type="number"
          value={victimAge}
          onChange={(event) => setVictimAge(parseInt(event.target.value))}
        />
        <button type="submit" disabled={isNaN(victimAge) || victimAge <= 0}>
          Guardar
        </button>
      </form>
      <div>
        <div>Categoría</div>
      </div>
      {AGE_OPTIONS.map((ageOptions) => (
        <button onClick={() => handleAgeCategoryUpdate(ageOptions)} key={ageOptions}>
          {ageOptions}
        </button>
      ))}

      <OmitButton onOmit={onOmit} />
    </>
  );
};

type NameProps = {
  noteId: string;
  onFilled: () => void;
  onOmit: () => void;
};

const Name = ({ noteId, onFilled, onOmit }: NameProps) => {
  const [victimName, setVictimName] = useState("");

  const handleVictimNameUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!victimName.trim()) return;

    dbUpdateNoteField(noteId, "victimName", victimName).then(() => {
      setVictimName("");
      onFilled();
    });
  };

  return (
    <>
      <form onSubmit={handleVictimNameUpdate}>
        <label htmlFor="victim-name">Nombre de la víctima</label>
        <input
          id={"victim-name"}
          value={victimName}
          onChange={(event) => setVictimName(event.target.value)}
        />
        <button type="submit" disabled={!victimName.trim()}>
          Guardar
        </button>
      </form>
      <OmitButton onOmit={onOmit} />
    </>
  );
};

type DateProps = {
  noteId: string;
  onFilled: () => void;
  onOmit: () => void;
};

const MONTHS:Record<number, {month:string;days:number}> = {
  1:{
    month:"Enero",
    days: 31
  },
  2: {
    month:"Febrero",
    days: 29
  },
  3: {
    month:"Marzo",
    days: 31
  },
  4: {
    month:"Abril",
    days: 30
  },
  5: {
    month:"Mayo",
    days: 31
  },
  6: {
    month:"Junio",
    days: 30
  },
  7: {
    month:"Julio",
    days: 31
  },
  8: {
    month:"Agosto",
    days: 31
  },
  9: {
    month:"Septiembre",
    days: 30
  },
  10: {
    month:"Octubre",
    days: 31
  },
  11: {
    month:"Noviembre",
    days: 30
  },
  12: {
    month:"Diciembre",
    days: 31
  },
};

const Date = ({ noteId, onFilled, onOmit }: DateProps) => {
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2023);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value);

    if (day > MONTHS[newMonth].days) {
      setDay(1);
    }
    setMonth(newMonth);
  };

  const handleAgeNumberUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dbUpdateNoteField(noteId, "date", { day, month, year }).then(onFilled);
  };

  return (
    <>
      <form onSubmit={handleAgeNumberUpdate}>
        <span>
          <label htmlFor="day">Día:</label>
          <select
            id="day"
            value={day}
            onChange={(event) => setDay(parseInt(event.target.value))}
          >
            {Array.from(Array(MONTHS[month].days), (_, index) => index + 1).map(
              (dayItem) => (
                <option value={dayItem}>{dayItem}</option>
              )
            )}
          </select>
        </span>
        <span>
          <label htmlFor="month">Mes:</label>
          <select id="month" value={month} onChange={handleMonthChange}>
            {Object.entries(MONTHS).map(([index,monthItem]) => (
              <option value={index}>{monthItem.month}</option>
            ))}
          </select>
        </span>
        <span>
          <label htmlFor="year">Año:</label>
          <select
            id="year"
            value={year}
            onChange={(event) => setYear(parseInt(event.target.value))}
          >
            {[2018,2019, 2020, 2021, 2022, 2023].map((yearItem) => (
              <option key={yearItem} value={yearItem}>
                {yearItem}
              </option>
            ))}
          </select>
        </span>
        <button type="submit" disabled={!day || month< 0 || !year}>
          Guardar
        </button>
      </form>
      <OmitButton onOmit={onOmit} />
    </>
  );
};

const Coordinates = ({ noteId, onFilled, onOmit }: NameProps) => {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 }); // latitude: N-S, longitude: E-W

  const handleGoogleMapsUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUrl = new URL(event.target.value);
    // example google maps url https://www.google.com/maps/place/20%C2%B035'05.5%22N+100%C2%B024'15.9%22W/@20.5848626,-100.4066228,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x2e1789a4ae40a179!8m2!3d20.5848576!4d-100.4044288
    // the part that matters is data=...!3d20.5848576!4d-100.4044288
    // in this case 20.5848576 is latitude, and -100.4044288 is longitude
    // @ is the center, NOT the pin position https://stackoverflow.com/a/58993992
    // https://stackoverflow.com/questions/57256671/how-do-i-get-the-address-and-coordinates-given-this-google-place-url
    const dataUrl = newUrl.pathname
      .split("/")
      .find((ii) => ii.startsWith("data"));

    const latitudeUrlString = dataUrl?.split('!').find(dataItem => dataItem.startsWith('3d'))?.replace('3d','')
    const longitudeUrlString = dataUrl?.split('!').find(dataItem => dataItem.startsWith('4d'))?.replace('4d','')

    if (!latitudeUrlString || !longitudeUrlString ) {
      setCoordinates({ latitude: 0, longitude: 0 });
      return;
    }

    const latitude = parseFloat(latitudeUrlString)
    const longitude = parseFloat(longitudeUrlString)

    if (!isNaN(latitude) && !isNaN(latitude)) {
      setCoordinates({ latitude, longitude });
      return;
    }

    setCoordinates({ latitude: 0, longitude: 0 });

  };

  const handleCoordinatesChange = (
    type: "latitude" | "longitude",
    newValue: string
  ) => {
    const valueNumeric = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);

    if (type === "latitude") {
      setCoordinates((prev) => ({ ...prev, latitude: valueNumeric }));
    } else {
      setCoordinates((prev) => ({ ...prev, longitude: valueNumeric }));
    }
  };

  const isDisableSubmit = !coordinates.latitude || !coordinates.longitude;

  const handleCoordinatesUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDisableSubmit) return;

    dbUpdateNoteField(noteId, "coordinates", coordinates).then(() => {
      setCoordinates({ latitude: 0, longitude: 0 });
      onFilled();
    });
  };

  return (
    <>
      <form onSubmit={handleCoordinatesUpdate}>
        <label htmlFor="google-url">Google maps url</label>
        <input
          id={"google-url"}
          type="text"
          onChange={handleGoogleMapsUrlChange}
        />

        <div>
            {!!coordinates.latitude && !!coordinates.longitude &&
          <a
          href={`https://www.google.com/maps/?q=${coordinates.latitude},${coordinates.longitude}`}
          target="_blank"
          rel="noreferrer"
          >
            google maps
          </a>
        }
        </div>
        <label htmlFor="latitude">Latitud</label>
        <input
          id={"latitude"}
          value={coordinates.latitude}
          type="number"
          onChange={(event) =>
            handleCoordinatesChange("latitude", event.target.value)
          }
        />
        <label htmlFor="longitude">Longitud</label>
        <input
          id={"longitude"}
          value={coordinates.longitude}
          type="number"
          onChange={(event) =>
            handleCoordinatesChange("longitude", event.target.value)
          }
        />
        <button type="submit" disabled={isDisableSubmit}>
          Guardar
        </button>
      </form>
      <OmitButton onOmit={onOmit} />
    </>
  );
};

type ReviewActionBarProps = {
    field: NoteInfoFieldsType;
    noteId: string;
    nextNote: () => void;
    
  };

const ReviewActionBar = ({
  field,
  noteId,
  nextNote,
}: ReviewActionBarProps) => {
  const handleSexUpdate = (newSexValue: NoteInfo["sex"]) => {
    dbUpdateNoteField(noteId, "sex", newSexValue).then(nextNote);
  };

  const handleVictimTransportUpdate = (newVictimTransport: NoteInfo['victimTransport']) => {
    dbUpdateNoteField(noteId, 'victimTransport', newVictimTransport).then(nextNote);
  };

  switch (field) {
    case "sex":
      return (
        <>
          {SEX_OPTIONS.map((sexValue) => (
            <button onClick={() => handleSexUpdate(sexValue)}>
              {sexValue}
            </button>
          ))}
          <OmitButton onOmit={nextNote} />
        </>
      );
    case "ageRange":
      return <Age noteId={noteId} onFilled={nextNote} onOmit={nextNote} />;
    case "victimName":
      return <Name noteId={noteId} onFilled={nextNote} onOmit={nextNote} />;
    case "date":
      return <Date noteId={noteId} onFilled={nextNote} onOmit={nextNote} />;
    case 'coordinates':
      return (
        <Coordinates noteId={noteId} onFilled={nextNote} onOmit={nextNote} />
      );
      case 'victimTransport':
        return (
          <>
            {TRANSPORT_OPTIONS.map((transportItem) => (
              <button onClick={() => handleVictimTransportUpdate(transportItem)}>
                {transportItem}
              </button>
            ))}
            <OmitButton onOmit={nextNote} />
          </>
        );
    default:
      return <div>hola</div>;
  }
};

export default ReviewActionBar;
