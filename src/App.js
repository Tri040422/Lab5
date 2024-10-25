import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Row,
  Table,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // Default list of students
  const [students, setStudents] = useState([
    { name: "Nguyen Van A", code: "CODE12345", active: true },
    { name: "Tran Van B", code: "CODE67890", active: false },
  ]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    code: "",
    active: false,
  });
  const [selectedCount, setSelectedCount] = useState(0);

  // Add new student to the top of the list
  const handleAddStudent = () => {
    if (newStudent.name && newStudent.code) {
      setStudents([newStudent, ...students]); // Add to top
      setNewStudent({ name: "", code: "", active: false }); // Reset form
    }
  };

  // Delete a student by index
  const handleDeleteStudent = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  // Handle checkbox selection to update selected count
  const handleSelectStudent = (checked) => {
    setSelectedCount(checked ? selectedCount + 1 : selectedCount - 1);
  };

  // Clear all students and reset selected count
  const handleClearStudents = () => {
    setStudents([]);
    setSelectedCount(0);
  };

  return (
    <Container className="mt-5">
      {/* Header with total selected students and clear button */}
      <Row className="">
        <Col>
          <h2>Total Selected Student: {selectedCount}</h2>
        </Col>
        <Col>
          <Button variant="primary" onClick={handleClearStudents}>
            Clear
          </Button>
        </Col>
      </Row>

      {/* Form to add a new student */}
      <Row className="mt-5">
        <Col>
          <FormControl
            placeholder="Student Name"
            value={newStudent.name}
            onChange={(e) =>
              setNewStudent({ ...newStudent, name: e.target.value })
            }
          />
          <FormControl
            className="mt-2"
            placeholder="Student Code"
            value={newStudent.code}
            onChange={(e) =>
              setNewStudent({ ...newStudent, code: e.target.value })
            }
          />
          <Form.Check
            className="mt-2"
            type="checkbox"
            label={"Still Active"}
            checked={newStudent.active}
            onChange={(e) =>
              setNewStudent({ ...newStudent, active: e.target.checked })
            }
          />
        </Col>
        <Col>
          <Button variant="primary" onClick={handleAddStudent}>
            Add
          </Button>
        </Col>
      </Row>

      {/* Table to display the list of students */}
      <Row className="mt-5">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Select</th>
              <th>Student Name</th>
              <th>Student Code</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>
                  <Form.Check
                    type="checkbox"
                    onChange={(e) => handleSelectStudent(e.target.checked)}
                  />
                </td>
                <td>{student.name}</td>
                <td>{student.code}</td>
                <td>
                  <Button variant={student.active ? "info" : "danger"}>
                    {student.active ? "Active" : "In-active"}
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteStudent(index)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

export default App;
