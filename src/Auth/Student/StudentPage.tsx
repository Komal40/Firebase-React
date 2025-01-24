// import React, { useState, useEffect } from "react";
// import { db, auth } from "../firebase";

// const StudentsPage = () => {
//   const [students, setStudents] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     id: "",
//     class: "",
//     section: "",
//     rollNumber: "",
//     // Add more fields here as needed
//   });

//   useEffect(() => {
//     const fetchStudents = async () => {
//       const snapshot = await db.collection("students").get();
//       setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     };
//     fetchStudents();
//   }, []);

//   const handleAddStudent = async () => {
//     await db.collection("students").add(formData);
//     setShowModal(false);
//     setFormData({});
//   };

//   const handleDeleteStudent = async (id) => {
//     await db.collection("students").doc(id).delete();
//     setStudents((prev) => prev.filter((student) => student.id !== id));
//   };

//   return (
//     <div>
//       <button onClick={() => setShowModal(true)}>Add Student</button>
//       {showModal && (
//         <div>
//           <h2>Add Student</h2>
//           <form>
//             <input
//               type="text"
//               placeholder="Name"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//             {/* Add more fields */}
//             <button type="button" onClick={handleAddStudent}>
//               Submit
//             </button>
//           </form>
//         </div>
//       )}
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Class</th>
//             <th>Section</th>
//             <th>Roll Number</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student.id}>
//               <td>{student.id}</td>
//               <td>{student.name}</td>
//               <td>{student.class}</td>
//               <td>{student.section}</td>
//               <td>{student.rollNumber}</td>
//               <td>
//                 <button>Edit</button>
//                 <button onClick={() => handleDeleteStudent(student.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StudentsPage;

// src/pages/Students.tsx
import React, { useEffect, useState,ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, deleteDoc, doc ,updateDoc} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { TextField } from "@mui/material";

import { db , auth} from "../../Firebase";
import Modal from "./Modall";
import { Student } from "./Types";
import './StudentPage.css'


const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<String | null>(null);
  const [editedStudent, setEditedStudent] = useState<Partial<Student>>({});

  // Handle Edit Button Click
  const handleEditClick = (student: Student) => {
    setEditingId(student.id);
    setEditedStudent({ ...student });
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
   // Save Updated Student
   const handleSaves = () => {
    if (editingId === null) return;
    setStudents((prev) =>
      prev.map((student) =>
        student.id === editingId ? { ...student, ...editedStudent } : student
      )
    );
    setEditingId(null); // Exit edit mode
  };

   // Save the updated student details
   const handleSave = async () => {
    if (!editingId || !editedStudent.id) return;
    if (editedStudent) {
      const studentRef =  doc(db, "students", editedStudent.id);

      try {
        // Update student in Firebase
        await updateDoc(studentRef, {
          name: editedStudent.name,
          class: editedStudent.class,
          section: editedStudent.section,
          rollNumber: editedStudent.rollNumber,
        });

        // Update state with the new student data
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === editingId ? { ...student, ...editedStudent } : student
          )
        );

        setEditedStudent({});
        setEditingId(null); // Exit edit mode
        alert("Student updated successfully!");
      } catch (error) {
        console.error("Error updating student:", error);
        alert("Failed to update student. Please try again.");
      }
    }
  };

  // Cancel Editing
  const handleCancel = () => {
    setEditingId(null);
    setEditedStudent({});
  };



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/login"); // Redirect to login page if not authenticated
      }
    });
    return unsubscribe; // Cleanup listener on unmount
  }, [navigate]);

   // Fetch students from Firestore
   useEffect(() => {
    if (isAuthenticated) {
      // const fetchStudents = async () => {
      //   const querySnapshot = await getDocs(collection(db, "students"));
      //   const studentData: Student[] = [];
      //   querySnapshot.forEach((studentdoc) => {
      //     studentData.push({ ...studentdoc.data(), id: studentdoc.id } as Student);
      //   });
      //   setStudents(studentData);
      // };
      fetchStudents();
    }
  }, [isAuthenticated]);


  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const studentData: Student[] = [];
    querySnapshot.forEach((studentdoc) => {
      studentData.push({ ...studentdoc.data(), id: studentdoc.id } as Student);
    });
    setStudents(studentData);
  };

  const addStudent = async (student: Omit<Student, "id">) => {
    const docRef = await addDoc(collection(db, "students"), student);
    fetchStudents(); // Reload students list
  };

  const deleteStudent = async (id: string) => {
    await deleteDoc(doc(db, "students", id));
    fetchStudents(); // Reload students list
  };



  const handleLogout = async () => {
    await signOut(auth); // Log out user
    alert('Logged out')
    navigate("/login");  // Redirect to login page
  };

  return (
    <div>
      <h2>Students List</h2>
      <button type='button' onClick={() => setShowModal(true)}>Add Student</button>
      {showModal && <Modal addStudent={addStudent} closeModal={() => setShowModal(false)} />}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Roll Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {students.map((student,idx) => (
            <tr key={student.id} >
              <td>{idx+1}</td>
              {editingId === student.id ? (
                <>
                  <td>
                    <TextField
                      type="text"
                      name="name"
                      value={editedStudent.name || ""}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <TextField
                      type="text"
                      name="class"
                      value={editedStudent.class || ""}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <TextField
                      type="text"
                      name="section"
                      value={editedStudent.section || ""}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <TextField
                      type="text"
                      name="rollNumber"
                      value={editedStudent.rollNumber || ""}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <button type='button' onClick={handleSave}>Save</button>
                    <button type='button' onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{student.name}</td>
                  <td>{student.class}</td>
                  <td>{student.section}</td>
                  <td>{student.rollNumber}</td>
                  <td>
                    <button type='button' onClick={() => handleEditClick(student)}>Edit</button>
                    <button type='button' onClick={() => deleteStudent(student.id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}

        </tbody>
      </table>

    </div>
  );
};

export default Students;
