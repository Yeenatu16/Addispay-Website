'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AdminRole = 'Super Admin' | 'Blog Writer' | 'Career Writer';

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  status: 'Active' | 'Revoked';
  addedDate: string;
}

interface AdminContextType {
  currentUser: TeamMember | null;
  loginAs: (email: string, role?: AdminRole) => boolean;
  logout: () => void;
  teamMembers: TeamMember[];
  addTeamMember: (name: string, email: string, role: AdminRole) => void;
  toggleTeamMemberStatus: (id: string) => void;
  removeTeamMember: (id: string) => void;
}

const defaultTeam: TeamMember[] = [
  {
    id: 'usr-1',
    email: 'admin@addispay.et',
    name: 'Super Admin Officer',
    role: 'Super Admin',
    status: 'Active',
    addedDate: '2026-01-10',
  },
  {
    id: 'usr-2',
    email: 'blog@addispay.et',
    name: 'Bethlehem Tilahun (Blog Lead)',
    role: 'Blog Writer',
    status: 'Active',
    addedDate: '2026-03-15',
  },
  {
    id: 'usr-3',
    email: 'careers@addispay.et',
    name: 'Solomon Haile (HR Recruiter)',
    role: 'Career Writer',
    status: 'Active',
    addedDate: '2026-04-01',
  },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeam);

  useEffect(() => {
    const savedUser = localStorage.getItem('addispay_admin_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse admin session', e);
      }
    }
  }, []);

  const loginAs = (email: string, roleHint?: AdminRole): boolean => {
    // Check if email exists in team list
    const found = teamMembers.find(
      (m) => m.email.toLowerCase() === email.toLowerCase() && m.status === 'Active'
    );

    if (found) {
      setCurrentUser(found);
      localStorage.setItem('addispay_admin_user', JSON.stringify(found));
      return true;
    }

    // Dynamic role mapping based on email keyword to allow easy login
    let assignedRole: AdminRole = 'Super Admin';
    const lowerEmail = email.toLowerCase();
    
    if (roleHint) {
      assignedRole = roleHint;
    } else if (lowerEmail.includes('blog') || lowerEmail.includes('writer')) {
      assignedRole = 'Blog Writer';
    } else if (lowerEmail.includes('career') || lowerEmail.includes('hr') || lowerEmail.includes('job') || lowerEmail.includes('recruit')) {
      assignedRole = 'Career Writer';
    }

    const demoUser: TeamMember = {
      id: `usr-${Date.now()}`,
      email,
      name: email.split('@')[0].toUpperCase(),
      role: assignedRole,
      status: 'Active',
      addedDate: new Date().toISOString().split('T')[0],
    };

    setCurrentUser(demoUser);
    localStorage.setItem('addispay_admin_user', JSON.stringify(demoUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('addispay_admin_user');
  };

  const addTeamMember = (name: string, email: string, role: AdminRole) => {
    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      status: 'Active',
      addedDate: new Date().toISOString().split('T')[0],
    };
    setTeamMembers((prev) => [newMember, ...prev]);
  };

  const toggleTeamMemberStatus = (id: string) => {
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'Active' ? 'Revoked' : 'Active' }
          : m
      )
    );
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{
        currentUser,
        loginAs,
        logout,
        teamMembers,
        addTeamMember,
        toggleTeamMemberStatus,
        removeTeamMember,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
