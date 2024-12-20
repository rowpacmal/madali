import { useState } from 'react';
import axios from 'axios';
import jsonServer from '../../utils/jsonServer.config';
import Course from '../../model/Course';

function useCourseService() {
  const [baseURL] = useState(jsonServer.url);
  const [endpoint] = useState('courses');

  async function addCourse(courseData) {
    try {
      if (!courseData) {
        throw new Error('Course data is required');
      }

      // Check if course already exists.
      const courses = await getCourses();

      if (!courses) {
        throw new Error('Courses not found');
      }

      let exists = false;

      for (let i = 0; i < courses.length; i++) {
        if (courses[i].id === courseData.id) {
          exists = true;
          break;
        }
      }

      // Add course if it doesn't exist.
      if (!exists) {
        const response = await axios.post(
          `${baseURL}/${endpoint}`,
          new Course(courseData)
        );
        const data = await response.data;
        console.info('Course:', data);

        return data;
      }

      // Throw error if course already exists.
      throw new Error('Course already exists');
    } catch (error) {
      console.error('Error adding course:', error);
      return error;
    }
  }

  async function deleteCourse(id) {
    try {
      if (!id) {
        throw new Error('Course ID is required');
      }

      const response = await axios.delete(`${baseURL}/${endpoint}/${id}`);
      const data = await response.data;
      console.info('Course:', data);

      return data;
    } catch (error) {
      console.error('Error deleting course:', error);
      return error;
    }
  }

  async function getCourses() {
    try {
      const response = await axios.get(`${baseURL}/${endpoint}`);
      const data = await response.data;
      console.info('Courses:', data);

      return data;
    } catch (error) {
      console.error('Error getting courses:', error);
      return error;
    }
  }

  async function getCourse(id) {
    try {
      if (!id) {
        throw new Error('Course ID is required');
      }

      const response = await axios.get(`${baseURL}/${endpoint}/${id}`);
      const data = await response.data;
      console.info('Course:', data);

      return data;
    } catch (error) {
      console.error('Error getting course:', error);
      return error;
    }
  }

  async function updateCourse(id, updateData) {
    try {
      if (!id) {
        throw new Error('Course ID is required');
      }

      if (!updateData) {
        throw new Error('Update data is required');
      }

      const courseExists = await getCourse(id);

      if (!courseExists) {
        throw new Error('Course not found');
      }

      const fieldsToUpdate = Object.entries(updateData);

      for (let i = 0; i < fieldsToUpdate.length; i++) {
        if (courseExists[fieldsToUpdate[i][0]]) {
          courseExists[fieldsToUpdate[i][0]] = fieldsToUpdate[i][1];
        } else {
          console.warn(
            `Field ${fieldsToUpdate[i][0]} does not exist in course`
          );
        }
      }

      const response = await axios.put(
        `${baseURL}/${endpoint}/${id}`,
        new Course(courseExists)
      );
      const data = await response.data;
      console.info('Course:', data);

      return data;
    } catch (error) {
      console.error('Error updating course:', error);
      return error;
    }
  }

  return { addCourse, deleteCourse, getCourses, getCourse, updateCourse };
}

export default useCourseService;
