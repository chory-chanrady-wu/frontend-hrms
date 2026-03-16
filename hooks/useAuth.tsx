import { createContext, useContext, useState, useEffect } from "react";
import { getUser, getRoleById } from "@/lib/api";

type AuthContextType = {
  user: any;
  permissions: string[];
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndPermissions() {
      try {
        const userDataRaw = await getUser();
        const userData = Array.isArray(userDataRaw)
          ? userDataRaw[0]
          : userDataRaw;
        setUser(userData);
        if (userData?.roleId) {
          const role = await getRoleById(userData.roleId);
          // Permissions may be a string or array
          let perms = role.permissions;
          if (typeof perms === "string") {
            try {
              perms = JSON.parse(perms);
            } catch (e) {
              console.error("Failed to parse permissions string:", perms);
              perms = [];
            }
          }
          setPermissions(Array.isArray(perms) ? perms : []);
        }
      } catch (err) {
        setUser(null);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndPermissions();
  }, []);

  return (
    <AuthContext.Provider value={{ user, permissions, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
