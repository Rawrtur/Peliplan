import { TouchableOpacity } from 'react-native'
import ThemedText from './ThemedText'

const Button = ({ text, onPress, disabled, secondary = false }: { text: string, onPress: () => void, disabled?: boolean, secondary?: boolean }) => {
    return (
        <TouchableOpacity
            className={`
                will-change-variable py-4 w-full items-center justify-center
                 rounded-full ${secondary
                    ? "bg-background border-2 border-primary shadow-[0_8px_0_rgb(0_50_50),0_12px_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:translate-y-[8px] active:shadow-[0_0px_0_rgb(0_50_50)] transitions-all duration-50"
                    : "bg-primary shadow-[0_8px_0_rgb(0_0_0),0_12px_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:translate-y-[8px] active:shadow-[0_0px_0_rgb(0_0_0)] transitions-all duration-50"} 
                    `}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={1}
        >
            <ThemedText
                type="bold"
                themeColor={secondary ? "text" : "textSecondary"}
            >{text}</ThemedText>
        </TouchableOpacity>
    )
}

export default Button