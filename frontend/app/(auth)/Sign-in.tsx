import { View, Text } from 'react-native'
import { Link, router } from 'expo-router'
import React from 'react'
import ThemedText from '@/components/ThemedText'

const SignIn = () => {
  return (
    <View className='w-full h-screen bg-background justify-center items-center'>
      <Text>SignIn</Text>
      <Link href={"/(flow)/PickTasks"}>
      <ThemedText>Click</ThemedText>
      </Link>
    </View>
  )
}

export default SignIn