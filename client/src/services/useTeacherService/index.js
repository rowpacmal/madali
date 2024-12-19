import { useState } from 'react';
import axios from 'axios';
import jsonServer from '../../utils/jsonServer.config';
import Teacher from '../../model/Teacher';

function useTeacherService() {
  const [baseURL] = useState(jsonServer.url);
  const [endpoint] = useState('teachers');

  async function addTeacher(teacherData) {
    try {
      if (!teacherData) {
        throw new Error('Teacher data is required');
      }

      // Check if teacher already exists.
      const teachers = await getTeachers();

      if (!teachers) {
        throw new Error('Teachers not found');
      }

      let exists = false;

      for (let i = 0; i < teachers.length; i++) {
        if (teachers[i].id === teacherData.id) {
          exists = true;
          break;
        }
      }

      // Add teacher if it doesn't exist.
      if (!exists) {
        const response = await axios.post(
          `${baseURL}/${endpoint}`,
          new Teacher(teacherData)
        );
        const data = await response.data;
        console.info('Teacher:', data);

        return data;
      }

      // Throw error if teacher already exists.
      throw new Error('Teacher already exists');
    } catch (error) {
      console.error('Error adding teacher:', error);
      return error;
    }
  }

  async function deleteTeacher(id) {
    try {
      if (!id) {
        throw new Error('Teacher ID is required');
      }

      const response = await axios.delete(`${baseURL}/${endpoint}/${id}`);
      const data = await response.data;
      console.info('Teacher:', data);

      return data;
    } catch (error) {
      console.error('Error deleting teacher:', error);
      return error;
    }
  }

  async function getTeachers() {
    try {
      const response = await axios.get(`${baseURL}/${endpoint}`);
      const data = await response.data;
      console.info('Teachers:', data);

      return data;
    } catch (error) {
      console.error('Error getting teachers:', error);
      return error;
    }
  }

  async function getTeacher(id) {
    try {
      if (!id) {
        throw new Error('Teacher ID is required');
      }

      const response = await axios.get(`${baseURL}/${endpoint}/${id}`);
      const data = await response.data;
      console.info('Teacher:', data);

      return data;
    } catch (error) {
      console.error('Error getting teacher:', error);
      return error;
    }
  }

  async function updateTeacher(id, updateData) {
    try {
      if (!id) {
        throw new Error('Teacher ID is required');
      }

      if (!updateData) {
        throw new Error('Update data is required');
      }

      const teacher = await getTeacher(id);

      if (!teacher) {
        throw new Error('Teacher not found');
      }

      const fieldsToUpdate = Object.entries(updateData);

      for (let i = 0; i < fieldsToUpdate.length; i++) {
        if (teacher[fieldsToUpdate[i][0]]) {
          teacher[fieldsToUpdate[i][0]] = fieldsToUpdate[i][1];
        } else {
          console.warn(
            `Field ${fieldsToUpdate[i][0]} does not exist in teacher`
          );
        }
      }

      const response = await axios.put(
        `${baseURL}/${endpoint}/${id}`,
        new Teacher(teacher)
      );
      const data = await response.data;
      console.info('Teacher:', data);

      return data;
    } catch (error) {
      console.error('Error updating teacher:', error);
      return error;
    }
  }

  return { addTeacher, deleteTeacher, getTeachers, getTeacher, updateTeacher };
}

export default useTeacherService;
