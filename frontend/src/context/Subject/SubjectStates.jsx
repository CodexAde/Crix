/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import SubjectContext from "./SubjectContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../AuthContext";

const SubjectStates = ({ children }) => {
    const { user } = useAuth();
    const [userSubjects, setUserSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    const fetchUserSubjects = useCallback(async () => {
        if (!user) return;
        try {
            setLoadingSubjects(true);
            const response = await axios.get("/users/subjects");
            setUserSubjects(response.data.subjects);
        } catch (error) {
            console.error("Failed to fetch user subjects", error);
        } finally {
            setLoadingSubjects(false);
        }
    }, [user]);

    const addUserSubject = async (subjectId) => {
        try {
            const response = await axios.post("/users/subjects", { subjectId });
            setUserSubjects(response.data.subjects);
            toast.success("Subject added successfully!");
            return true;
        } catch (error) {
            console.error("Failed to add subject", error);
            toast.error(error.response?.data?.message || "Failed to add subject");
            return false;
        }
    };

    const reorderSubjects = async (newOrder) => {
        // Optimistic update
        const previousOrder = [...userSubjects];
        setUserSubjects(newOrder);

        try {
            await axios.patch("/users/subjects", { newOrder: newOrder.map(s => s._id) });
        } catch (error) {
            console.error("Failed to reorder subjects", error);
            toast.error("Failed to save new order");
            setUserSubjects(previousOrder); // Revert on failure
        }
    };

    useEffect(() => {
        if (!user) {
             setUserSubjects([]);
             setLoadingSubjects(false);
        }
    }, [user]);

    return (
        <SubjectContext.Provider value={{ userSubjects, loadingSubjects, fetchUserSubjects, addUserSubject, reorderSubjects }}>
            {children}
        </SubjectContext.Provider>
    );
};

export default SubjectStates;
