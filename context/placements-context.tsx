"use client";

import React, { createContext, useReducer, useMemo, useCallback, useState, useEffect } from "react"
import {
  getAllPlacements,
  getCompanyBranchMapping,
  getBranchCompanyMapping,
  type Placement,
  type CompanyBranchMapping,
  type BranchCompanyMapping,
  type PlacementsAction
} from "../lib/placement-api";

function placementsReducer(state: Placement[], action: PlacementsAction): Placement[] {
  switch (action.type) {
    case "SET_PLACEMENTS":
      return action.payload
    case "ADD_PLACEMENT":
      return [action.payload, ...state]
    default:
      return state
  }
}

export const PlacementsContext = createContext<
  | {
      state: Placement[];
      dispatch: React.Dispatch<PlacementsAction>;
      fetchPlacements: () => Promise<void>;
      companyBranch: CompanyBranchMapping[];
      branchCompany: BranchCompanyMapping[];
      fetchCompanyBranch: () => Promise<void>;
      fetchBranchCompany: () => Promise<void>;
      loading: boolean;
    }
  | undefined
>(undefined)

export const PlacementsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(placementsReducer, [])
  const [companyBranch, setCompanyBranch] = useState<CompanyBranchMapping[]>([]);
  const [branchCompany, setBranchCompany] = useState<BranchCompanyMapping[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch placements from API
  const fetchPlacements = useCallback(async () => {
    try {
      const placements = await getAllPlacements();
      dispatch({ type: "SET_PLACEMENTS", payload: placements });
    } catch (e) {
      console.error("Error fetching placements:", e);
    }
  }, [])

  // Fetch company to branch mapping
  const fetchCompanyBranch = useCallback(async () => {
    try {
      const companyBranchMapping = await getCompanyBranchMapping();
      setCompanyBranch(companyBranchMapping);
    } catch (e) {
      console.error("Error fetching company branch mapping:", e);
    }
  }, []);

  // Fetch branch to company mapping
  const fetchBranchCompany = useCallback(async () => {
    try {
      const branchCompanyMapping = await getBranchCompanyMapping();
      setBranchCompany(branchCompanyMapping);
    } catch (e) {
      console.error("Error fetching branch company mapping:", e);
    }
  }, []);

  // Fetch all mappings and placements on mount with single loading state
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchPlacements(),
          fetchCompanyBranch(),
          fetchBranchCompany(),
        ]);
      } catch (error) {
        console.error("Error fetching placement data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [fetchPlacements, fetchCompanyBranch, fetchBranchCompany]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      fetchPlacements,
      companyBranch,
      branchCompany,
      fetchCompanyBranch,
      fetchBranchCompany,
      loading,
    }),
    [state, dispatch, fetchPlacements, companyBranch, branchCompany, fetchCompanyBranch, fetchBranchCompany, loading]
  );
  return <PlacementsContext.Provider value={value}>{children}</PlacementsContext.Provider>
}

// Custom hook to use placements context and fetch on demand
export function usePlacements() {
  const context = React.useContext(PlacementsContext)
  if (!context) throw new Error("usePlacements must be used within PlacementsContextProvider")
  return context
} 