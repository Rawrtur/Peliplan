import { View } from 'react-native'
import { Ionicons } from "@react-native-vector-icons/ionicons";




const Add = () => {
    return (
        <View
            className={`w-8 h-8 border-card bg-card rounded-full border-2 items-center justify-center`}
        >
            <Ionicons name="add" size={25} color="#FFFFFF" />
        </View>
    )
}

export default Add;