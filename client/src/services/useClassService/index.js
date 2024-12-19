import { useState } from 'react';
import axios from 'axios';
import jsonServer from '../../utils/jsonServer.config';
import Class from '../../model/Class';

function useClassService() {
  const [baseURL] = useState(jsonServer.url);
  const [endpoint] = useState('classes');

  async function addClass(classData) {
    try {
      if (!classData) {
        throw new Error('Class data is required');
      }

      // Check if class already exists.
      const classes = await getClasses();

      if (!classes) {
        throw new Error('Classes not found');
      }

      let exists = false;

      for (let i = 0; i < classes.length; i++) {
        if (classes[i].id === classData.id) {
          exists = true;
          break;
        }
      }

      // Add class if it doesn't exist.
      if (!exists) {
        const response = await axios.post(
          `${baseURL}/${endpoint}`,
          new Class(classData)
        );
        const data = await response.data;
        console.info('Class:', data);

        return data;
      }

      // Throw error if class already exists.
      throw new Error('Class already exists');
    } catch (error) {
      console.error('Error adding class:', error);
      return error;
    }
  }

  async function deleteClass(id) {
    try {
      if (!id) {
        throw new Error('Class ID is required');
      }

      const response = await axios.delete(`${baseURL}/${endpoint}/${id}`);
      const data = await response.data;
      console.info('Class:', data);

      return data;
    } catch (error) {
      console.error('Error deleting class:', error);
      return error;
    }
  }

  async function getClasses() {
    try {
      const response = await axios.get(`${baseURL}/${endpoint}`);
      const data = await response.data;
      console.info('Classes:', data);

      return data;
    } catch (error) {
      console.error('Error getting classes:', error);
      return error;
    }
  }

  async function getClass(id) {
    try {
      if (!id) {
        throw new Error('Class ID is required');
      }

      const response = await axios.get(`${baseURL}/${endpoint}/${id}`);
      const data = await response.data;
      console.info('Class:', data);

      return data;
    } catch (error) {
      console.error('Error getting class:', error);
      return error;
    }
  }

  async function updateClass(id, updateData) {
    try {
      if (!id) {
        throw new Error('Class ID is required');
      }

      if (!updateData) {
        throw new Error('Update data is required');
      }

      const classExists = await getClass(id);

      if (!classExists) {
        throw new Error('Class not found');
      }

      const fieldsToUpdate = Object.entries(updateData);

      for (let i = 0; i < fieldsToUpdate.length; i++) {
        if (classExists[fieldsToUpdate[i][0]]) {
          classExists[fieldsToUpdate[i][0]] = fieldsToUpdate[i][1];
        } else {
          console.warn(`Field ${fieldsToUpdate[i][0]} does not exist in class`);
        }
      }

      const response = await axios.put(
        `${baseURL}/${endpoint}/${id}`,
        new Class(classExists)
      );
      const data = await response.data;
      console.info('Class:', data);

      return data;
    } catch (error) {
      console.error('Error updating class:', error);
      return error;
    }
  }

  return { addClass, deleteClass, getClasses, getClass, updateClass };
}

export default useClassService;
