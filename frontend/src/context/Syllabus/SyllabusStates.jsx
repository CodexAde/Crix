/* eslint-disable react/prop-types */
import { useState, useCallback, useMemo, useRef } from 'react';
import SyllabusContext from './SyllabusContext';
import axios from 'axios';

const SyllabusStates = ({ children }) => {
    const [activeUnitData, setActiveUnitData] = useState(null);
    const [activeSubjectData, setActiveSubjectData] = useState(null);
    const [loadingUnit, setLoadingUnit] = useState(false);
    const [loadingSubject, setLoadingSubject] = useState(false);
    const [allSubjects, setAllSubjects] = useState([]);
    const [loadingAllSubjects, setLoadingAllSubjects] = useState(false);
    
    // Use Ref for cache to keep fetchUnitContent/fetchSubjectData stable
    const unitCache = useRef({});
    const subjectCache = useRef({});
    const pendingRequests = useRef({}); // Track in-flight promises to deduplicate concurrent calls

    const fetchUnitContent = useCallback(async (subjectId, unitId) => {
        const cacheKey = `${subjectId}_${unitId}`;
        
        // 1. Check persistent cache
        if (unitCache.current[cacheKey]) {
            setActiveUnitData(unitCache.current[cacheKey]);
            return;
        }

        // 2. Check for in-flight request to deduplicate
        if (pendingRequests.current[cacheKey]) {
            const data = await pendingRequests.current[cacheKey];
            setActiveUnitData(data);
            return;
        }

        // Pre-emptively clear or set to loading to avoid stale data from previous unit
        setActiveUnitData(null);

        try {
            setLoadingUnit(true);
            const requestPromise = axios.get(`/syllabus/${subjectId}/unit/${unitId}`);
            pendingRequests.current[cacheKey] = requestPromise;

            const response = await requestPromise;
            const unitContent = response.data.unit;
            
            setActiveUnitData(unitContent);
            unitCache.current[cacheKey] = unitContent;
        } catch (error) {
            console.error("Error fetching unit content:", error);
        } finally {
            delete pendingRequests.current[cacheKey];
            setLoadingUnit(false);
        }
    }, []);

    const fetchSubjectData = useCallback(async (subjectId) => {
        // 1. Check persistent cache
        if (subjectCache.current[subjectId]) {
            setActiveSubjectData(subjectCache.current[subjectId]);
            return;
        }

        // 2. Check for in-flight request
        if (pendingRequests.current[subjectId]) {
            const data = await pendingRequests.current[subjectId];
            setActiveSubjectData(data);
            return;
        }

        try {
            setLoadingSubject(true);
            const requestPromise = axios.get(`/syllabus/${subjectId}`);
            pendingRequests.current[subjectId] = requestPromise;

            const response = await requestPromise;
            const subject = response.data.subject;
            
            setActiveSubjectData(subject);
            subjectCache.current[subjectId] = subject;
        } catch (error) {
            console.error("Error fetching subject data:", error);
            setActiveSubjectData(prev => prev?._id === subjectId ? null : prev);
        } finally {
            delete pendingRequests.current[subjectId];
            setLoadingSubject(false);
        }
    }, []);

    const fetchAllSubjects = useCallback(async (force = false) => {
        if (!force && allSubjects.length > 0) return;
        
        try {
            setLoadingAllSubjects(true);
            const response = await axios.get('/syllabus');
            setAllSubjects(response.data.subjects || []);
        } catch (error) {
            console.error('Failed to fetch all subjects:', error);
        } finally {
            setLoadingAllSubjects(false);
        }
    }, [allSubjects.length]);

    const clearActiveUnit = useCallback(() => {
        setActiveUnitData(null);
    }, []);

    const contextValue = useMemo(() => ({
        activeUnitData, 
        activeSubjectData,
        allSubjects,
        loadingUnit, 
        loadingSubject,
        loadingAllSubjects,
        fetchUnitContent,
        fetchSubjectData,
        fetchAllSubjects,
        clearActiveUnit 
    }), [activeUnitData, activeSubjectData, allSubjects, loadingUnit, loadingSubject, loadingAllSubjects, fetchUnitContent, fetchSubjectData, fetchAllSubjects, clearActiveUnit]);

    return (
        <SyllabusContext.Provider value={contextValue}>
            {children}
        </SyllabusContext.Provider>
    );
};

export default SyllabusStates;
