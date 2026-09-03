import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (admin, token) => {
        set({
          admin,
          token,
          isAuthenticated: !!token
        });
      },
      
      logout: () => {
        set({
          admin: null,
          token: null,
          isAuthenticated: false
        });
      },
      
      loadAuth: () => {
        const token = localStorage.getItem('adminToken');
        const admin = localStorage.getItem('admin');
        
        if (token && admin) {
          set({
            admin: JSON.parse(admin),
            token,
            isAuthenticated: true
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.loadAuth();
      }
    }
  )
);
