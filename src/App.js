import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Row,
  Table,
} from "react-bootstrap";
import axios from "axios"; // Import axios
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    code: "",
    active: false,
  });
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "https://student-api-nestjs.onrender.com/students"
        );
        setStudents(Array.isArray(response.data) ? response.data : []); // Ensure data is an array
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    if (newStudent.name && newStudent.code) {
      try {
        const response = await axios.post(
          "https://student-api-nestjs.onrender.com/students",
          {
            studentCode: newStudent.code,
            name: newStudent.name,
            isActive: newStudent.active,
          }
        );
        setStudents([response.data, ...students]);
        setNewStudent({ name: "", code: "", active: false });
      } catch (error) {
        console.error("Error adding student:", error);
      }
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await axios.delete(
        `https://student-api-nestjs.onrender.com/students/${id}`
      );
      setStudents(students.filter((student) => student.id !== id)); // Adjust the filter condition based on your data structure
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleSelectStudent = (checked) => {
    setSelectedCount(checked ? selectedCount + 1 : selectedCount - 1);
  };

  const handleClearStudents = () => {
    setStudents([]);
    setSelectedCount(0);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2>Total Selected Student: {selectedCount}</h2>
        </Col>
        <Col>
          <Button variant="primary" onClick={handleClearStudents}>
            Clear
          </Button>
        </Col>
      </Row>

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
            {Array.isArray(students) && students.length > 0 ? (
              students.map((student, index) => (
                <tr key={index}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      onChange={(e) => handleSelectStudent(e.target.checked)}
                    />
                  </td>
                  <td>
                    <Link to={`/student/${student.id}`}>{student.name}</Link>{" "}
                    {/* Use student ID for navigation */}
                  </td>
                  <td>{student.code}</td>
                  <td>
                    <Button variant={student.active ? "info" : "danger"}>
                      {student.active ? "Active" : "In-active"}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No students available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
}

// Create a detailed student page component
const StudentDetail = ({ params }) => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudentDetail = async () => {
      const response = await axios.get(
        `https://student-api-nestjs.onrender.com/students/${params.id}`
      );
      setStudent(response.data);
    };

    fetchStudentDetail();
  }, [params.id]);

  return (
    <Container>
      {student ? (
        <div>
          <h2>{student.name}</h2>
          <p>Code: {student.studentCode}</p>
          <p>Status: {student.isActive ? "Active" : "Inactive"}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

// Wrap App with Router
function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/student/:id" element={<StudentDetail />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default Main;
