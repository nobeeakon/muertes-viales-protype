
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { get, child, ref, set, push, update } from "firebase/database";
import type {NoteInfo, NoteInfoFieldsType, NoteType, DataType} from './types';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCxeO-r8xnGfhKWw_1h9xhxMFE_ekVH6QU",
  authDomain: "muertes-viales.firebaseapp.com",
  projectId: "muertes-viales",
  storageBucket: "muertes-viales.appspot.com",
  messagingSenderId: "962567602136",
  appId: "1:962567602136:web:c50e2b896489e2eaa93cad"
};


// Initialize Firebase

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const filterUrls = (urls?:string[]) => {
  if (!urls) return [];

  return urls.map(urlItem => urlItem.trim())
  .map(urlString => {
    // valid urls
    try {
      new URL(urlString)
    } catch (error) {
      return ''
    }
    
    return urlString
  })
  .filter(Boolean)
}


export const dbSaveUrls = (urls:string[]) => {
  // Get a key for a new note.
  const noteId = push(child(ref(db), '/')).key??crypto.randomUUID();


  const filteredUrls = filterUrls(urls)

  if (filteredUrls.length === 0) return Promise.resolve();

  const data:NoteType =  {
    id: noteId,
      urls: filteredUrls,
    }

  return    set(ref(db, `/${noteId}`), data)
}

// const MIN_THREASHOLD = 3;




export const dbGetNotesUrl = async( field:NoteInfoFieldsType) => {

   const snapshot = await get(
        child(ref(db), `/`)
    )

    if (snapshot.exists()) {
          const data: DataType = snapshot.val()??{};



          const itemsWithNoData = Object.values(data).filter( dataItem =>  
            (filterUrls(dataItem?.urls).length  > 0 &&  !dataItem?.noteInfo?.[field] ) 
          ).map(dataItem => {
            const filteredUrls = filterUrls(dataItem?.urls);

            return {...dataItem, urls: filteredUrls}
          })


          console.log('hola', itemsWithNoData.slice(0,6))
          return itemsWithNoData;
          

        } 
          return null
        
}

export const dbUpdateNoteField = async<NoteField extends keyof NoteInfo>(noteId:string, key:NoteField, value: NoteInfo[NoteField]) => {


    const updates     = {
        [`${noteId}/noteInfo/${key}`] : value 
    }

    return update(ref(db), updates);

}