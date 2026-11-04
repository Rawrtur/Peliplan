import { useMemo } from 'react'
import { PanResponder, View } from 'react-native'
import Ionicons from '@react-native-vector-icons/ionicons'
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/theme';

export const TimeWheel = ({
    label,
    value,
    step,
    onChange,
}: {
    label: string
    value: string
    step: number
    onChange: (amount: number) => void
}) => {
    const panResponder = useMemo(
        () => {
            let lastAppliedSteps = 0
            return PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponderCapture: (_, gesture) =>
                    Math.abs(gesture.dy) > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
                onPanResponderGrant: () => {
                    lastAppliedSteps = 0
                },
                onPanResponderMove: (_, gesture) => {
                    const nextSteps = Math.trunc(-gesture.dy / 24)
                    const stepDifference = nextSteps - lastAppliedSteps
                    if (stepDifference !== 0) {
                        onChange(stepDifference * step)
                        lastAppliedSteps = nextSteps
                    }
                },
                onPanResponderTerminationRequest: () => false,
            })
        },
        [onChange, step],
    )

    return (
        <View
            {...panResponder.panHandlers}
            accessibilityLabel={`${label}: ${value}. Swipe up or down to change.`}
            className="w-28 items-center gap-2 rounded-2xl bg-background px-4 py-5"
        >
            <ThemedText themeColor="textMuted">{label}</ThemedText>
            <Ionicons name="chevron-up" size={18} color={Colors.textMuted} />
            <ThemedText type="bold" className="text-2xl">{value}</ThemedText>
            <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
            <ThemedText themeColor="textMuted">Swipe</ThemedText>
        </View>
    )
}