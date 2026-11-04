export const getCurrentMinutes = () => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
}

export const formatTime = (minutes: number) => {
    const normalizedMinutes = (minutes + 24 * 60) % (24 * 60)
    const hours = Math.floor(normalizedMinutes / 60)
    const remainingMinutes = normalizedMinutes % 60
    return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`
}