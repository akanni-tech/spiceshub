import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { addUser, getUserBySupabaseId } from '../hooks/services';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  // Function to ensure user exists in database
  const ensureUserInDatabase = async (user) => {
    if (!user) return;

    const payload = {
      firstName: user.user_metadata?.firstname || user.user_metadata?.first_name || 'Unknown',
      lastName: user.user_metadata?.lastname || user.user_metadata?.last_name || 'User',
      email: user.email,
      phoneNumber: user.user_metadata?.phoneNumber || user.phone || '',
      supabase_id: user.id,
      role: user.user_metadata?.role || 'ADMIN',
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
        try {
          const dbUser = await getUserBySupabaseId(session.user.id);
          setUserRole(dbUser.role);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('USER');
        } finally {
          setRoleLoading(false);
        }
      }
      setIsLoading(false);
      setRoleLoading(false);
      setRoleLoading(false);
    });

    // Real-time Session Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await ensureUserInDatabase(session.user);
          try {
            const dbUser = await getUserBySupabaseId(session.user.id);
            setUserRole(dbUser.role);
          } catch (error) {
            console.error('Error fetching user role:', error);
            setUserRole('USER');
          } finally {
            setRoleLoading(false);
          }
        } else {
          setUserRole(null);
          setRoleLoading(false);
        }
        setIsLoading(false);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);



  return { session, userRole, isLoading, roleLoading };
}