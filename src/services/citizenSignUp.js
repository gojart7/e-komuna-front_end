import axios from 'axios';

export const signUpCitizen = async ({ firstName, lastName, personalNumber, email }) => {
  try {
    const response = await axios.post('https://localhost:7060/api/Citizen/request', {
      firstName,
      lastName,
      personalNumber,
      email,
    });

    const data = response.data;
    console.log('Citizen sign-up response:', data);

    return {
      success: true,
      message: data.message || 'Sign-up request sent successfully.',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Sign-up failed.',
    };
  }
};
