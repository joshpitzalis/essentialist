Feature: Assignment Grading
  As a teacher
  I want to grade student assignment submissions
  So that students can receive feedback on their work


  Scenario: Successfully grade a submitted assignment
    Given there is an existing student enrolled to a class
    And an assignment exists for the class
    And the student has submitted the assignment
    When I assign the grade "A" to the student's assignment
    Then the assignment should be graded successfully

  Scenario: Attempt to grade an assignment without a submission
    Given there is an existing student enrolled to a class
    And an assignment exists for the class
    But the student has not submitted the assignment
    When I attempt to assign a grade to the student's assignment
    Then the grading should fail
    And I should receive an error message "Cannot grade unsubmitted assignment"

  Scenario: Attempt to grade with an invalid grade value
    Given there is an existing student enrolled to a class
    And an assignment exists for the class
    And the student has submitted the assignment
    When I assign the grade "Z" to the student's assignment
    Then the grading should fail
    And I should receive an error message "Invalid grade value"

  Scenario: Attempt to grade a non-existent assignment
    Given there is an existing student enrolled to a class
    When I attempt to assign a grade to a non-existent assignment
    Then the grading should fail
    And I should receive an error message "Assignment not found"