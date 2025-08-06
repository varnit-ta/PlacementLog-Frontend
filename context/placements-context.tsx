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
      setLoading(true);
      const placements = await getAllPlacements();
      dispatch({ type: "SET_PLACEMENTS", payload: placements });
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, [])

  // Fetch company to branch mapping
  const fetchCompanyBranch = useCallback(async () => {
    try {
      setLoading(true);
      const companyBranchMapping = await getCompanyBranchMapping();
      setCompanyBranch(companyBranchMapping);
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch branch to company mapping
  const fetchBranchCompany = useCallback(async () => {
    try {
      setLoading(true);
      const branchCompanyMapping = await getBranchCompanyMapping();
      setBranchCompany(branchCompanyMapping);
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all mappings and placements on mount
  useEffect(() => {
    Promise.all([
      fetchPlacements(),
      fetchCompanyBranch(),
      fetchBranchCompany(),
    ]).finally(() => setLoading(false));
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