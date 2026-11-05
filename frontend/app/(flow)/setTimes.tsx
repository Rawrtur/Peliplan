import { useCallback, useState } from 'react'
import { View, TouchableOpacity, Image, Modal } from 'react-native'
import Ionicons from '@react-native-vector-icons/ionicons'
import { router } from "expo-router";
import ThemedText from '@/components/ThemedText';
import { Colors } from '@/constants/theme';
import { getCurrentMinutesPlus5Minutes, formatTime } from '@/utils/utils';
import { TimeWheel } from '@/components/TimeWheel';
import Button from '@/components/Button';
import { useApp } from '../../context/AppContext';

type TimeField = 'start' | 'end'

const SetTimes = () => {
    const [startTime, setStart] = useState(getCurrentMinutesPlus5Minutes)
    const [endTime, setEnd] = useState<number | null>(null)
    const [editingField, setEditingField] = useState<TimeField | null>(null)
    const [draftTime, setDraftTime] = useState(getCurrentMinutesPlus5Minutes)

    const openTimePicker = (field: TimeField) => {
        setDraftTime(field === 'end' && endTime !== null ? endTime : getCurrentMinutesPlus5Minutes())
        setEditingField(field)
    }

    const { setStartTime, setEndTime } = useApp();


    const adjustDraftTime = useCallback((amount: number) => {
        setDraftTime((currentTime) => (currentTime + amount + 24 * 60) % (24 * 60))
    }, [])

    const saveTime = () => {
        if (editingField === 'start') {
            setStart(draftTime)
        } else if (editingField === 'end') {
            setEnd(draftTime)
        }
        setEditingField(null)
    }

    return (
        <View className="w-full flex-1 h-screen pt-10 bg-background">
            <Image
                source={require("../../assets/images/waves.png")}
                resizeMode="contain"
                pointerEvents="none"
                style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    aspectRatio: 1,
                }}
            />
            <TouchableOpacity
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={30} color="black" className="ml-5" />
            </TouchableOpacity>
            <View className="w-full pr-30 pb-10 p-5">
                <View className="w-full flex-row">
                    <ThemedText
                        type="subtitle"
                        themeColor="text"
                    >When are you available?</ThemedText>
                    <Image source={require("../../assets/images/splash.png")} className="w-15 h-15 ml-2" />
                </View>
                <ThemedText
                    type="default"
                    themeColor="textMuted"
                >You can adjust the times at any time later on.</ThemedText>
            </View>
            <View className="w-full px-5 gap-3">
                <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => openTimePicker('start')}
                    className="w-full rounded-full bg-white p-4 items-center flex-row justify-between"
                >
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={30} color={Colors.textMuted} />
                        <ThemedText
                            type="default"
                            themeColor="textMuted"
                        >Start Time</ThemedText>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <ThemedText
                            type="bold"
                        >{formatTime(startTime)}</ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    accessibilityRole="button"
                    onPress={() => openTimePicker('end')}
                    className="w-full rounded-full bg-white p-4 items-center flex-row justify-between"
                >
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={30} color={Colors.textMuted} />
                        <ThemedText
                            type="default"
                            themeColor="textMuted"
                        >End Time</ThemedText>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <ThemedText
                            type="bold"
                        >{endTime === null ? 'Not set' : formatTime(endTime)}</ThemedText>
                        <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
                    </View>
                </TouchableOpacity>
            </View>
            <Modal
                visible={editingField !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setEditingField(null)}
            >
                <View className="flex-1 justify-center bg-black/40 p-5">
                    <View className="w-full rounded-3xl bg-white p-6 gap-5">
                        <ThemedText type="subtitle" themeColor="text">
                            {editingField === 'start' ? 'Set start time' : 'Set end time'}
                        </ThemedText>
                        <View className="flex-row justify-center gap-10">
                            <TimeWheel
                                label="Hour"
                                value={formatTime(draftTime).slice(0, 2)}
                                step={60}
                                onChange={adjustDraftTime}
                            />
                            <TimeWheel
                                label="Minute"
                                value={formatTime(draftTime).slice(3, 5)}
                                step={1}
                                onChange={adjustDraftTime}
                            />
                        </View>
                        {editingField === 'end' && (
                            <TouchableOpacity
                                onPress={() => {
                                    setEnd(null)
                                    setEditingField(null)
                                }}
                                className="items-center py-2"
                            >
                                <ThemedText themeColor="textMuted">Remove end time</ThemedText>
                            </TouchableOpacity>
                        )}
                        <View className="flex-row justify-end gap-3">
                            <TouchableOpacity
                                onPress={() => setEditingField(null)}
                                className="rounded-full border-2 border-primary px-5 py-3"
                            >
                                <ThemedText type="bold">Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={saveTime}
                                className="rounded-full bg-primary px-5 py-3"
                            >
                                <ThemedText type="bold" themeColor="textSecondary">Save</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View className="w-full absolute bottom-20 p-5">
                <Button
                    text="Continue →"
                    onPress={() => {
                        setStartTime(formatTime(startTime));
                        setEndTime(endTime ? formatTime(endTime) : undefined);
                        router.push("/setTimes");
                    }}
                />
            </View>
        </View>
    )
}

export default SetTimes