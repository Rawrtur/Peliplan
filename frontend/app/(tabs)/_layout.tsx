import { Tabs } from 'expo-router'

const TabLayout = () => {
  return (
    <Tabs screenOptions={{headerShown:false}}>
      <Tabs.Screen name="index" options={{tabBarLabel: 'Home'}} />
      <Tabs.Screen name="templates" options={{tabBarLabel: 'Templates'}} />
      <Tabs.Screen name="settings" options={{tabBarLabel: 'Settings'}} />
    </Tabs>
  )
}

export default TabLayout