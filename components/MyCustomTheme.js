import { DefaultTheme } from '@react-navigation/native';

const MyCustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    background: '#ffffff',
    card: '#B8A90B',
    text: '#333333',
  },
};

export default MyCustomTheme;

/* :

primary:        Ensisijainen väri, jota käytetään yleensä korostuksissa.
background:     Sovelluksen taustaväri.
card:           Korttien ja navigointipalkkien taustaväri.
text:           Tekstiväri.
border:         Reunojen väri.
notification:   Ilmoitusväri, jota käytetään esimerkiksi ilmoitusmerkeissä. */