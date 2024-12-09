import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperDefaultTheme } from 'react-native-paper';

const spacing = {
  small: 8,
  medium: 16,
  large: 24,
}

const LightTheme = {
  ...NavigationDefaultTheme,
  ...PaperDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    ...PaperDefaultTheme.colors,
    primary: '#F4F4FB',
    background: '#F4F4FB',
    card: '#FFFFFF',
    navbar: '#8fd2ff',
    button: '#09132F',
    text: '#250f50',
    surface: '#DDEDFF'
  },
  spacing,
};

const DarkTheme = {
  ...NavigationDarkTheme,
  ...PaperDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    ...PaperDarkTheme.colors,
    primary: 'blue',
    background: '#2e2d2d',
    card: '#1e1e1e',
    button: '#0A0A0A',
    text: '#8fd2ff',
    navbar: '#1e1e1e',
  },
  spacing,  
};

export default { LightTheme, DarkTheme, spacing };

/* :

primary:        Ensisijainen väri, jota käytetään yleensä korostuksissa.
background:     Sovelluksen taustaväri.
card:           Korttien ja navigointipalkkien taustaväri.
text:           Tekstiväri.
border:         Reunojen väri.
notification:   Ilmoitusväri, jota käytetään esimerkiksi ilmoitusmerkeissä. */