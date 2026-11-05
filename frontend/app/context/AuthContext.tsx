import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import SafeAsyncStorage from "../../utils/SafeAsyncStorage";

export interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;
    signIn: (email: string, password: string) => Promise<({ success: boolean, message: string })>;
    signUp: (name: string, email: string, password: string) => Promise<({ success: boolean, message: string })>;
    verify: (email: string, code: string) => Promise<({ success: boolean, message: string })>;
    resendVerificationCode: (email: string) => Promise<({ success: boolean, message: string })>;
    logout: () => void;
    error: string | null;
    isLoading: boolean;
    clearError: () => void;
    setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // erster Aufruf beim Start der App, um den Authentifizierungsstatus zu überprüfen
        const initializeAuthState = async () => {
            try {
                setIsLoading(true);
                // kleiner Timeout um den AsyncStorage Zugriff zu simulieren, da es manchmal zu schnell ist und die App abstürzt
                await new Promise(resolve => setTimeout(resolve, 500)); // Simuliere eine Verzögerung von 1 Sekunde

                // Lade den Token und die Benutzerdaten aus dem AsyncStorage
                const storedToken = await SafeAsyncStorage.getItem("authToken");
                const storedUser = await SafeAsyncStorage.getItem("user");

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    const user = JSON.parse(storedUser);  // Userdaten umwandeln in User Object
                    setUser(user);
                    setIsLoggedIn(true);
                }

            } catch (error) {
                console.error("Error initializing auth: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuthState();
    }, [])

    const signIn = async (email: string, password: string) => { throw new Error("Not implemented"); }

    const signUp = async (name: string, email: string, password: string) => { throw new Error("Not implemented"); }

    const verify = async (email:string, code:string) => {throw new Error("Not implemented"); }

    const resendVerificationCode = async (email: string) => {throw new Error("Not implemented"); }

    const logout = async () => {
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);    
        throw new Error("Not fully implemented"); 
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                token,
                signIn,
                signUp,
                verify,
                resendVerificationCode,
                logout,
                error,
                isLoading,
                clearError: () => setError(null),
                setError
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}  