// src/components/Modal.tsx
import React, { useState } from "react";
import TextField from '@mui/material/TextField';

import { Student } from "./Types";

interface ModalProps {
  addStudent: (student: Omit<Student, "id">) => void;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ addStudent, closeModal }) => {
  const [name, setName] = useState<string>("");
  const [className, setClassName] = useState<string>("");
  const [section, setSection] = useState<string>("");
  const [rollNumber, setRollNumber] = useState<string>("");

  const handleSubmit = () => {
    const student = { name, class: className, section, rollNumber };
    addStudent(student);
    closeModal();
  };

  return (
    <div>
      <h3>Add Student</h3>
      <form style={{display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'flex-start'}}>
        <TextField
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          type="text"
          placeholder="Class"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <TextField
          type="text"
          placeholder="Section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        />
        <TextField
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <button type="button" onClick={handleSubmit} style={{height:'100%'}}>
          Submit
        </button>
      </form>
      <button type='button' onClick={closeModal} >Close</button>
    </div>
  );
};

export default Modal;
