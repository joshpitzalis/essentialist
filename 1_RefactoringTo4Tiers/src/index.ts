import express from 'express';
import { assignStudentToAssignmentController, getStudentGradesController, getStudentSubmittedAssignmentsController, getStudentByIdController, getStudentsController, assignStudentToClassController, createStudentController } from './features/students/controllers';

import { createClassController } from './features/classes/controllers';
import { gradeAssignmentController, getAssignmentsByClassIdController, getAssignmentByIdController, submitAssignmentController, createAssignmentController } from './features/assignments/controllers';



const app = express();
app.use(express.json());


// API Endpoints

// students
app.post('/students', createStudentController);
app.post('/student-assignments', assignStudentToAssignmentController)
app.get('/students', getStudentsController)
app.get('/students/:id', getStudentByIdController)




// classes
app.post('/classes', createClassController);
app.post('/class-enrollments', assignStudentToClassController)
app.get('/classes/:id/assignments', getAssignmentsByClassIdController)




// assignments 
app.post('/assignments', createAssignmentController)
app.post('/student-assignments/submit', submitAssignmentController)
app.post('/student-assignments/grade', gradeAssignmentController)
app.get('/assignments/:id', getAssignmentByIdController)
app.get('/student/:id/assignments', getStudentSubmittedAssignmentsController)
app.get('/student/:id/grades', getStudentGradesController)


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
