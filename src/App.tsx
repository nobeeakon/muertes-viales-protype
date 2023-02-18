import React from 'react';
import './App.css';
import AddNotes from './add-notes/AddNotes';
import ParseAndAddNotes from './add-notes/ParseAndAddNotes';
import Review from './review/Review';

function App() {



  return (
    <div >
      <AddNotes />
    <ParseAndAddNotes />
<Review/>
    </div>
  );
}

export default App;
