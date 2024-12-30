import * as React from 'react';

import TodoThreeStages from '../TodoThreeStages/TodoThreeStages'
import './TodoApp.css'



export default function TodoApp() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  return (
    <>
  
      <TodoThreeStages/>
      
    
    
    </>
  );
}
