import axios from 'axios';

// Rely on axios.defaults.baseURL set in AuthContext.jsx
const getTestByReference = async (referenceId) => {
    try {
        const response = await axios.get(`/tests/reference/${referenceId}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

const getTestById = async (testId) => {
    try {
        const response = await axios.get(`/tests/${testId}`);
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

const getLatestAttempt = async (testId) => {
    try {
        const response = await axios.get(`/tests/${testId}/latest-attempt`);
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

const submitTest = async (testId, answers) => {
    try {
        const response = await axios.post(`/tests/submit`, {
            testId,
            answers
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: "Network error" };
    }
};

export { getTestByReference, getTestById, submitTest, getLatestAttempt };
