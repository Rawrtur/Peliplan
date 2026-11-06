import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import SafeAsyncStorage from "../utils/SafeAsyncStorage";

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

    /**
     * Sign In for a user in the peliplan app
     * @param email User Email
     * @param password User Password non hashed
     * @returns Backend response {success:boolean, message: string}
     */
    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(`${process.env.PELIPLAN_API_KEY}/auth/sign-in`, {
                method: "POST",
                headers: { 'Contet-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (response.status === 429) {
                setError("Your reached the rate limit")
                return { success: false, message: "Your reached the rate limit." }
            };

            const data = await response.json();

            if (!response.ok || data.error) {
                setError(data.message || data.error || "Sign In Failed unexpected");
                return { success: false, message: data.message || data.error || "Sign In Failed unexpected" };
            };

            return data

        } catch (error: any) {
            const errorMessage = error.message || "An Error occurred during sign In.";
            setError(errorMessage);
            console.error("Sign In Error:", error);
            return { success: false, message: errorMessage };

        } finally {
            setIsLoading(false);
        }
    }

    /**
     * Sign Up Function for peliplan
     * @param name User name
     * @param email User email in plain text
     * @param password User password in in plain text
     * @returns backend response {success: boolean, message: string}
     */
    const signUp = async (name: string, email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(false);

            const response = await fetch(`${process.env.PELIPLAN_API_KEY}/auth/sign-up`, {
                method: "POST",
                headers: { 'Contet-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            if (response.status === 429) {
                setError("Your reached the rate limit")
                return { success: false, message: "Your reached the rate limit." }
            };

            const data = await response.json();

            if (!response.ok || data.error) {
                setError(data.message || data.error || "Sign Up Failed unexpected");
                return { success: false, message: data.message || data.error || "Sign Up Failed unexpected" };
            };

            return data

        } catch (error: any) {
            const errorMessage = error.message || "An Error occoured during sign up.";
            setError(errorMessage);
            console.error("Sign up Error: ", error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }

    const verify = async (email: string, code: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(`${process.env.PELIPLAN_API_KEY}/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            if (response.status === 429) {
                setError("Your reached the rate limit.")
                return { success: false, message: "Your reached the rate limit." }
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "verification Failed.");
            }
            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            const { token, user } = data.data;

            await SafeAsyncStorage.setItem("authToken", token);
            await SafeAsyncStorage.setItem("user", user);

            setUser(user);
            setToken(token);

            setIsLoggedIn(true);
            return { success: true, message: data.message };
        } catch (error: any) {
            const errorMessage = error.message || "An Error occoured during Verification.";
            setError(errorMessage);
            console.error("Sign up Error: ", error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }

    const resendVerificationCode = async (email: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(`${process.env.PELIPLAN_API_KEY}/auth/resend-verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.status === 429) {
                setError("Reached Rate Limit")
                return { success: false, message: "Reached Rate Limit" }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 253 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            return data;

        } catch (error: any) {
            const errorMessage = error.message || "An Error occoured during Verification.";
            setError(errorMessage);
            console.error("Sign up Error: ", error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        // throw new Error("Not fully implemented");
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