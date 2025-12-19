import axios from 'axios'
import { supabase } from './supabaseClient';


export const flaskClient = axios.create({
  baseURL: 'http://localhost:5050/api'
});

// Axios Request Interceptor: Attach the current Supabase JWT to every outgoing request
flaskClient.interceptors.request.use(async config => {
  // Get the current session
  const {data: {session}} = await supabase.auth.getSession();

  if (session && session.access_token) {
    // This JWT is sent to Flask for verification
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});



// Example usage in a component:
export const getProtectedData = async () => {
  try {
    const response = await flaskClient.get('/protected');
    return response.data;
  } catch (error) {
    console.error('Access Denied or Token Invalid:', error);
    throw error;
  }
};


// main axios routes
async function createNewPost(title, content) {
  const newPostData = {
    title: title,
    content: content
  };

  try {
    // The interceptor runs here and adds the Authorization header
    const response = await flaskClient.post('/posts', newPostData);
    
    console.log('Post created successfully:', response.data);
    return response.data; // The newly created post object
  } catch (error) {
    console.error('Error creating post:', error.response?.data || error.message);
    throw error;
  }
}


async function getPostById(postId) {
  try {
    // The postId is added directly to the URL path
    const response = await flaskClient.get(`/posts/${postId}`);
    
    console.log(`Fetched post ${postId}:`, response.data);
    return response.data; // Single post object
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error.response?.data || error.message);
    throw error;
  }
}


async function updatePost(postId, newContent) {
  const updatedData = {
    content: newContent // Only sending the field(s) we want to update
  };

  try {
    const response = await flaskClient.put(`/posts/${postId}`, updatedData);
    
    console.log('Post updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error.response?.data || error.message);
    throw error;
  }
}


async function deletePost(postId) {
  try {
    // No data is typically sent in the body for DELETE requests
    await flaskClient.delete(`/posts/${postId}`);
    
    console.log(`Post ${postId} deleted successfully.`);
    return true;
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error.response?.data || error.message);
    throw error;
  }
}