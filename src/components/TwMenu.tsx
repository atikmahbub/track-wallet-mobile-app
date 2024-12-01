import React, {useState} from 'react';
import {Menu, Button} from 'react-native-paper';
import {View, StyleSheet} from 'react-native';
import {darkTheme} from '@trackingPortal/themes/darkTheme';

interface TwMenuProps {
  options: {label: string; value: any}[];
  onSelect: (value: any) => void;
  buttonLabel?: string;
}

const TwMenu: React.FC<TwMenuProps> = ({
  options,
  onSelect,
  buttonLabel = 'Select Option',
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (value: any) => {
    onSelect(value);
    closeMenu();
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        theme={darkTheme}
        anchor={
          <Button mode="outlined" onPress={openMenu}>
            {buttonLabel}
          </Button>
        }>
        {options.map(option => (
          <Menu.Item
            key={option.value}
            onPress={() => handleSelect(option.value)}
            title={option.label}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TwMenu;
