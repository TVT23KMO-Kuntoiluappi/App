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
    primary: 'blue',
    background: '#EFF5D5',
    card: '#B8A90B',
    text: '#333333',
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
    background: '#333333',
    card: '#B8A90B',
    text: '#EFF5D5',
  },
  spacing,  
};

export default { LightTheme, DarkTheme };

/* :

primary:        Ensisijainen väri, jota käytetään yleensä korostuksissa.
background:     Sovelluksen taustaväri.
card:           Korttien ja navigointipalkkien taustaväri.
text:           Tekstiväri.
border:         Reunojen väri.
notification:   Ilmoitusväri, jota käytetään esimerkiksi ilmoitusmerkeissä. */