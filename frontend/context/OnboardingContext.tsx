import { createContext, ReactNode, useContext, useState } from "react";

export interface OnboardingContextType {
    loading: boolean;
    name: string,
    setName: (name: string) => void;
    email: string,
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(false); // vielleicht fuer spaetere Implementationen hilfreich -> Moeglichkeit zur kostenlosen vor generierung beim sign up
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <OnboardingContext.Provider
            value={{
                loading,
                name,
                setName,
                email,
                setEmail,
                password,
                setPassword
            }}
        >
            {children}
        </OnboardingContext.Provider>
    )
}

export const useOnboard = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useOnboard must be used within an Appprovider");
    }
    return context;
}