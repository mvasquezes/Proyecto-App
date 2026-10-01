import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavigation from '../components/MenuNavegacion';

export default function Index() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View 
      className="flex-1 bg-bg-color" 
      style={{ paddingTop: insets.top }}
    >
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Saludo */}
        <View className="w-full px-6 pt-8 pb-4 flex-row justify-between items-center">
          <Text className="text-color-menu text-xl font-inter-bold">
            Hola, Usuario 👋
          </Text>
        </View>
      </ScrollView>

      {/* Navegación inferior fija */}
      <BottomNavigation />
    </View>
  );
}