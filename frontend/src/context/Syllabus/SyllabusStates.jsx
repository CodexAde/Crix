/* eslint-disable react/prop-types */
import { useState, useCallback, useMemo, useRef } from 'react';
import SyllabusContext from './SyllabusContext';
import axios from 'axios';

const SyllabusStates = ({ children }) => {
    const [activeUnitData, setActiveUnitData] = useState(null);
    const [loadingUnit, setLoadingUnit] = useState(false);
    // Use Ref for cache to keep fetchUnitContent stable
    const unitCache = useRef({});

    const fetchUnitContent = useCallback(async (subjectId, unitId) => {
        const cacheKey = `${subjectId}_${unitId}`;
        
        if (unitCache.current[cacheKey]) {
            setActiveUnitData(unitCache.current[cacheKey]);
            return;
        }

        try {
            setLoadingUnit(true);
            const { data } = await axios.get(`/syllabus/${subjectId}/unit/${unitId}`);
            
            const unitContent = data.unit;
            setActiveUnitData(unitContent);
            
            unitCache.current[cacheKey] = unitContent;
        } catch (error) {
            console.error("Error fetching unit content:", error);
            setActiveUnitData(null);
        } finally {
            setLoadingUnit(false);
        }
    }, []);

    const clearActiveUnit = useCallback(() => {
        setActiveUnitData(null);
    }, []);

    const value = useMemo(() => ({
        activeUnitData, 
        loadingUnit, 
        fetchUnitContent,
        clearActiveUnit 
    }), [activeUnitData, loadingUnit, fetchUnitContent, clearActiveUnit]);

    return (
        <SyllabusContext.Provider value={value}>
            {children}
        </SyllabusContext.Provider>
    );
};

export default SyllabusStates;
