import { useState } from 'react';
import axios from 'axios';
import jsonServer from '../../utils/jsonServer.config';
import Student from '../../model/Student';

function useStudentService() {
  const [baseURL] = useState(jsonServer.url);
  const [endpoint] = useState('students');

  async function addStudent(studentData) {
    try {
      if (!studentData) {
        throw new Error('Student data is required');
      }

      // Check if student already exists.
      const students = await getStudents();

      if (!students) {
        throw new Error('Students not found');
      }

      let exists = false;

      for (let i = 0; i < students.length; i++) {
        if (students[i].id === studentData.id) {
          exists = true;
          break;
        }
      }

      // Add student if it doesn't exist.
      if (!exists) {
        const response = await axios.post(
          `${baseURL}/${endpoint}`,
          new Student(studentData)
        );
        const data = await response.data;
        console.info('Student:', data);

        return data;
      }

      // Throw error if student already exists.
      throw new Error('Student already exists');
    } catch (error) {
      console.error('Error adding student:', error);
      return error;
    }
  }

  async function deleteStudent(id) {
    try {
      if (!id) {
        throw new Error('Student ID is required');
      }

      const response = await axios.delete(`${baseURL}/${endpoint}/${id}`);
      const data = await response.data;
      console.info('Student:', data);

      return data;
    } catch (error) {
      console.error('Error deleting student:', error);
      return error;
    }
  }

  async function getStudents() {
    try {
      const response = await axios.get(`${baseURL}/${endpoint}`);
      const data = await response.data;
      console.info('Students:', data);

      return data;
    } catch (error) {
      console.error('Error getting students:', error);
      return error;
    }
  }

  async function getStudent(id) {
    try {
      if (!id) {
        throw new Error('Student ID is required');
      }

      const response = await axios.get(`${baseURL}/${endpoint}/${id}`);
      const data = await response.data;
      console.info('Student:', data);

      return data;
    } catch (error) {
      console.error('Error getting student:', error);
      return error;
    }
  }

  async function updateStudent(id, updateData) {
    try {
      if (!id) {
        throw new Error('Student ID is required');
      }

      if (!updateData) {
        throw new Error('Update data is required');
      }

      const studentExists = await getStudent(id);

      if (!studentExists) {
        throw new Error('Student not found');
      }

      const fieldsToUpdate = Object.entries(updateData);

      for (let i = 0; i < fieldsToUpdate.length; i++) {
        if (studentExists[fieldsToUpdate[i][0]]) {
          studentExists[fieldsToUpdate[i][0]] = fieldsToUpdate[i][1];
        } else {
          console.warn(
            `Field ${fieldsToUpdate[i][0]} does not exist in student`
          );
        }
      }

      const response = await axios.put(
        `${baseURL}/${endpoint}/${id}`,
        new Student(studentExists)
      );
      const data = await response.data;
      console.info('Student:', data);

      return data;
    } catch (error) {
      console.error('Error updating student:', error);
      return error;
    }
  }

  return { addStudent, deleteStudent, getStudents, getStudent, updateStudent };
}

export default useStudentService;
