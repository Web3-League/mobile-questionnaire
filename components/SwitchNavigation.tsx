import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { styles } from './stylesHc';

type Route = {
  name: string;
  target: string;
};

type RootStackParamList = {
  [key: string]: undefined;
};

type SwitchNavigationProps = {
  routes: Route[];
  currentRoute: string;
};
const SwitchNavigation: React.FC<SwitchNavigationProps> = ({ routes, currentRoute }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handlePress = (routeName: string) => {
    navigation.navigate(routeName);
  };

  return (
    <View style={styles.switchContainer}>
      {routes.map((route, index) => (
        <TouchableOpacity
          key={route.name}
          style={[
            styles.switchButton,
            currentRoute === route.target ? styles.switchButtonActive : null,
            index === 0 ? styles.switchButtonFirst : null,
            index === routes.length - 1 ? styles.switchButtonLast : null,
          ]}
          onPress={() => handlePress(route.target)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.switchButtonText,
              currentRoute === route.target ? styles.switchButtonTextActive : null,
            ]}
          >
            {route.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SwitchNavigation;