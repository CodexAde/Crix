/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from 'react';
import UserContext from './UserContext';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const UserStates = ({ children }) => {
    const { user: authUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        if (!authUser) return;
        try {
            setLoading(true);
            const { data } = await axios.get('/users/profile');
            // Backend returns { data: userProfile, message: ... } via ApiResponse
            setUserProfile(data.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        if (authUser) {
            if (authUser.subjects) {
                // If authUser already has detailed subjects, it's the full profile
                setUserProfile(authUser);
                setLoading(false);
            } else {
                fetchProfile();
            }
        } else {
            setUserProfile(null);
            setLoading(false);
        }
    }, [authUser, fetchProfile]);

    return (
        <UserContext.Provider value={{ userProfile, loading, fetchProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserStates;
