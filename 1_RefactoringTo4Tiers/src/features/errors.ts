class InvalidRequestBodyException extends Error {
  constructor(missingKeys: string[]) {
    super("Body is missing required key: " + missingKeys.join(", "));
  }
}

class AssignmentNotFoundException extends Error {
  constructor() {
    super("Assignment not found");
  }
}

class InvalidGradeException extends Error {
  constructor(grade: any) {
    super(`Invalid grade: ${grade}`);
  }
}

class StudentAssignmentNotFoundException extends Error {
  constructor() {
    super(
      "Student assignment not found. Please, make sure the student is assigned to the assignment."
    );
  }
}

class ClassNotFoundException extends Error {
  constructor(id: string) {
    super(`Class with id ${id} not found`);
  }
}

class StudentAlreadyEnrolledException extends Error {
  constructor() {
    super("Student is already enrolled in class");
  }
}

class StudentNotFoundException extends Error {
  constructor() {
    super("Student not found");
  }
}

export {
  InvalidRequestBodyException,
  StudentNotFoundException,
  StudentAlreadyEnrolledException,
  AssignmentNotFoundException,
  InvalidGradeException,
  StudentAssignmentNotFoundException,
  ClassNotFoundException,
};
