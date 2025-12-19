import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { addUser } from '../hooks/services';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to ensure user exists in database
  const ensureUserInDatabase = async (user) => {
    if (!user) return;

    const payload = {
      firstName: user.user_metadata?.firstname || user.user_metadata?.first_name || 'Unknown',
      lastName: user.user_metadata?.lastname || user.user_metadata?.last_name || 'User',
      email: user.email,
      phoneNumber: user.user_metadata?.phoneNumber || user.phone || '',
      supabase_id: user.id,
      role: user.user_metadata?.role || 'USER'
    };

    try {
      await addUser(payload);
    } catch (error) {
      // User might already exist, ignore error
      console.log('User already exists or error creating user:', error);
    }
  };

  // Session Check and Listener
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await ensureUserInDatabase(session.user);
      }
      setIsLoading(false);
    });

    // Real-time Session Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await ensureUserInDatabase(session.user);
        }
        setIsLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);


  // Role Extraction 
  useEffect(() => {
    if (session) {
      // Read role from metadata
      const currentRole = session.user?.user_metadata?.role;
      setUserRole(currentRole || 'student');
    } else {
      // Clear role on logout
      setUserRole(null);
    }
  }, [session])

  return { session, userRole, isLoading };
}