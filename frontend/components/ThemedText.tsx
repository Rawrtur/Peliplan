import { Text, TextProps, StyleSheet } from 'react-native'
import {Colors} from "@/constants/theme"

export type ThemeColor = keyof typeof Colors;


export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'bold' | 'subtitle' | 'link' | 'linkPrimary';
  themeColor?: ThemeColor;
};

const ThemedText = ({style, type, themeColor, ...rest}:ThemedTextProps) => {
  return (
      <Text className="font-rubik-semibold" style={[{
        color: themeColor ? Colors[themeColor] : Colors.text},
        styles[type ?? 'default'],
        style
      ]} {...rest}/>
  )
}

const styles = StyleSheet.create({
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 500,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
  },
  bold: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 700,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
  },
  title: {
    fontSize: 48,
    fontWeight: 800,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 800,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 14,
    color: '#3c87f7',
  }
});

export default ThemedText;