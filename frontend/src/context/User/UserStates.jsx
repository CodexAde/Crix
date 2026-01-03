/* eslint-disable react/prop-types */
import { useState, useCallback, useEffect } from 'react';
import UserContext from './UserContext';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const UserStates = ({ children }) => {
    const { user: authUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ activeRoadmaps: 0, testAttempts: 0 });
    const [subjCount, setSubjCount] = useState(0);

    const fetchStats = useCallback(async () => {
        try {
            const [roadmapsData, testStats] = await Promise.all([
                axios.get('/roadmaps/my-roadmaps?count=true'),
                axios.get('/tests/stats')
            ]);
            setStats({
                activeRoadmaps: roadmapsData.data.data.totalRoadmaps || 0,
                testAttempts: testStats.data.data.count || 0
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, []);

    const fetchProfile = useCallback(async () => {
        if (!authUser) return;
        try {
            setLoading(true);
            const { data } = await axios.get('/users/profile');
            setUserProfile(data.data);
            setSubjCount(data.data.subjects?.length || 0);
            fetchStats();
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }, [authUser, fetchStats]);

    useEffect(() => {
        if (authUser) {
            if (authUser.subjects) {
                setUserProfile(authUser);
                setSubjCount(authUser.subjects?.length || 0);
                setLoading(false);
                fetchStats();
            } else {
                fetchProfile();
            }
        } else {
            setUserProfile(null);
            setSubjCount(0);
            setLoading(false);
        }
    }, [authUser, fetchProfile, fetchStats]);

    return (
        <UserContext.Provider value={{ userProfile, loading, fetchProfile, stats, subjCount }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserStates;
