import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import SafeAsyncStorage from "../../utils/SafeAsyncStorage";
import { useAuth } from "./AuthContext";

export interface AppContextType {
    loading: boolean; // muss unterschiedlich zu Auth.loading sein um gleichzeitiges Nutzen zu ermöglichen 
    aiLoading: boolean;
    templates: Template[],
    addTemplate: (title: string, todos: Todo[]) => Promise<({ success: boolean, message: string })>;
    deleteTemplate: (_id: string) => Promise<({ success: boolean, message: string })>;
    AppError: string | null;
    clearError: () => void;
    setAppError: (error: string | null) => void;
    todos: Todo[];
    setTodos: (todos: Todo[]) => void;
    startTime: string | undefined;
    endTime: string | undefined;
    setStartTime: (time: string) => void;
    setEndTime: (time: string|undefined) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [aiLoading, setAiLoading] = useState<boolean>(false);
    const [templates, setTemplates] = useState<Template[]>([]); // undefined wenn der Nutzer neu eingeloggt ist
    const [AppError, setAppError] = useState<string | null>(null);
    const [todos, setTodos] = useState<Todo[]>([{ id: 1, title: "Projektpräsentation vorbereiten", checked: false }]);
    const [startTime, setStartTime] = useState<string | undefined>(undefined);
    const [endTime, setEndTime] = useState<string | undefined>(undefined);

    const { user, isLoggedIn, logout } = useAuth(); // auf Auth Werte zugreifen

    useEffect(() => {
        // Templates aus AsyncStorage laden falls diese existieren
        const initializeAppState = async () => {
            try {
                setLoading(true);
                // kleiner Timeout um den AsyncStorage Zugriff zu simulieren, da es manchmal zu schnell ist und die App abstürzt
                await new Promise(resolve => setTimeout(resolve, 500)); // Simuliere eine Verzögerung von 1 Sekunde

                const storedTemplates = await SafeAsyncStorage.getItem("templates");

                if (storedTemplates) {
                    const temps = JSON.parse(storedTemplates);
                    setTemplates(temps);
                }

            } catch (error) {
                console.error("Error initializing App: ", error);
            } finally {
                setLoading(false);
            }
        };
        initializeAppState();
    }, [])

    const addTemplate = async (title: string, todos: Todo[]) => { throw new Error("Not implemented"); }

    const deleteTemplate = async (_id: string) => { throw new Error("Not implemented"); }

    return (
        <AppContext.Provider
            value={{
                loading,
                aiLoading,
                templates,
                addTemplate,
                deleteTemplate,
                AppError,
                clearError: () => setAppError(null),
                setAppError,
                todos,
                setTodos,
                startTime,
                endTime,
                setStartTime,
                setEndTime,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
}