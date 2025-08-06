const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface Placement {
  id?: number;
  company: string;
  ctc: number;
  placement_date: string;
  created_at?: string;
  branch_counts: { branch: string; count: number }[];
}

export interface CompanyBranchMapping {
  company: string;
  branches: { branch: string; count: number }[];
}

export interface BranchCompanyMapping {
  branch: string;
  companies: { company: string; count: number }[];
}

export type PlacementsAction =
  | { type: "SET_PLACEMENTS"; payload: Placement[] }
  | { type: "ADD_PLACEMENT"; payload: Placement };

export async function addPlacement(
  placement: { company: string; ctc: number; placement_date: string; students: string[] },
  token: string
): Promise<Placement> {
  const response = await fetch(`${API_BASE_URL}/admin/placements`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(placement),
  });
  const result = await response.json();
  if (result.err) throw new Error(result.data || 'API error');
  return result.data;
}

export async function getAllPlacements(): Promise<Placement[]> {
  const response = await fetch(`${API_BASE_URL}/placements`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await response.json();
  if (result.err) throw new Error(result.data || 'API error');
  return result.data;
}

export async function getCompanyBranchMapping(): Promise<CompanyBranchMapping[]> {
  const response = await fetch(`${API_BASE_URL}/placements/company-branch`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await response.json();
  if (result.err) throw new Error(result.data || 'API error');
  return result.data;
}

export async function getBranchCompanyMapping(): Promise<BranchCompanyMapping[]> {
  const response = await fetch(`${API_BASE_URL}/placements/branch-company`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await response.json();
  if (result.err) throw new Error(result.data || 'API error');
  return result.data;
} 