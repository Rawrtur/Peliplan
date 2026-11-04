import { TouchableOpacity } from 'react-native'
import { Ionicons } from "@react-native-vector-icons/ionicons";


export type CheckProps = {
    checked?: boolean;
    setChecked?: (checked: boolean) => void;
}

const Check = ({ checked, setChecked }: CheckProps) => {
    return (
        <TouchableOpacity
            className={`${checked ? "bg-primary border-primary" : "border-card"} w-8 h-8 rounded-full border-2 items-center justify-center`}
            onPress={() => setChecked && setChecked(!checked)}
        >
            <Ionicons name="checkmark" size={25} color="#FFFFFF" />
        </TouchableOpacity>
    )
}

export default Check