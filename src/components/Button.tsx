import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary';
  loading?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  type = 'primary', 
  loading = false,
  style 
}) => {
  const buttonStyles = [
    styles.button,
    type === 'primary' ? styles.primaryButton : styles.secondaryButton,
    style
  ];

  const textStyles = [
    styles.text,
    type === 'primary' ? styles.primaryText : styles.secondaryText
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={type === 'primary' ? '#FFFFFF' : '#0078D4'} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44
  },
  primaryButton: {
    backgroundColor: '#0078D4'
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0078D4'
  },
  text: {
    fontSize: 15,
    fontWeight: '600'
  },
  primaryText: {
    color: '#FFFFFF'
  },
  secondaryText: {
    color: '#0078D4'
  }
});

export default Button;
