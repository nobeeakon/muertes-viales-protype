export type NoteInfo = {
    sex: string;
    victimName: string;
    date: {
        year:number;
        month:number;
        day:number;
    };
    ageRange: string;
    victimTransport:string;
    coordinates: {
        latitude: number;
        longitude: number;
    }
}

export type NoteInfoFieldsType = keyof NoteInfo;
export const noteInfoFields:Array<keyof NoteInfo>= ['sex', 'victimName', 'date', 'ageRange',
    'victimTransport', 'coordinates'
]

export type NoteType = {
    id: string;
    urls: string[];
    noteInfo?: Partial<NoteInfo>;
}

export type DataType = Record<string, NoteType>

