---
title: Processus
---

Need to be writen

# Table of Contents
1. [Style](#markdown-header-style)
    1. [Templated component](#)
    1. [Styled component](#)
    1. [Inline style](#)
2. [Store](#)
3. [Type de component](#)
    3. [Container Component](#)
    3. [Wrapper Component](#)
    3. [Presentationnal Component](#)
    3. [Style Component](#)
4. [Normes syntaxiques](#)
    4. [Nommage](#)
    4. [Constants](#)
    4. [Utils](#)
5. [Flow types](#)
6. [Tests](#)
7. [Build apk unsigned](#)
https://stackoverflow.com/questions/35283959/build-and-install-unsigned-apk-on-device-without-the-development-server

<a name="style"></a>
## 1. Style
Il y a 3 manières de styliser les composants

### 1.1 Templated component
Ajouter une propriété directement dans le composant du template de Native Base
Cette option est recommandé sans le cas ou ce composant est récurrent dans l'app
```
src/template/liwi/styles/
```
On définit le template puis le composant : "NativeBase.Button"
Ajouter une propriété directement à NativeBase.Button affectera tout les boutons du projet.
Le but est de créer une sorte de classe appelable depuis les vues.
````js
 export default {
  'NativeBase.Button': {
    '.btnLiwi': {
      height: 70,
      backgroundColor: '#ff31d0',
      borderRadius: 35,
    },
    // Tous les buttons sont affectés avec la propriété margin 10
    margin: 10,
  },
}
````
Puis pour appeler la classe déclarée ci-dessus
````
<Button btnLiwi>
    <Text>Primary</Text>
</Button>
````
### 1.2 Styled component
Le but ici est de créer un composant sur mesure et de le rendre disponible dans le layout de l'app.
Comme overrider un style du template.
````
src/template/liwi/layout.js
````
on export une copie du composant souhaité
```js
export const TextExemple = styled(LText).attrs({
    margin: 20
})`
  color: #4e4e4e;
  font-family: roboto;
  font-weight: bold;
`;

```

Dans le layout nous acceptons uniquement les props de type boolean ou char:
Faire attention d'avoir des props unique !

```js
const Button = styled.button`
  /* Adapt the colors based on onPressStyle prop */
  background: ${props => props.onPressStyle ? "palevioletred" : "white"};
  color: ${props => props.onPressStyle ? "white" : "palevioletred"};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;

render(
  <div>
    <Button>Normal</Button>
    <Button onPressStyle>Primary</Button>
  </div>
);
```
Ou encore 
```js
// Create an Input component that'll render an <input> tag with some styles
const Text = styled.Text`
  padding: 0.5em;
  margin: 0.5em;
  color: ${props => props.inputColor || "palevioletred"};
  background: papayawhip;
  border: none;
  border-radius: 3px;
`;

// Render a styled text input with the standard input color, and one with a custom input color
render(
  <View>
    <Text inputColor="#ffffff">Bonjour toi !</Text>
    <Text inputColor="rebeccapurple">Bonsoir vous !</Text>
  </View>
);
```

### 1.3 Inline style
Si vous avez besoin d'un style spécifique inline a un composant, il faut créer un fichier dans le répertorie courant:
```



``` 

## 2. Store


### 2.1 React Contexts 
### 2.2 Redux
### 2.3 Sécurité
react-native-secure-key-store

A définir


## 3. Flow
## 5. Import
Relative path

## 5. Normes syntaxiques
### Nommage
- Class Component : PascalCase
- Method Component : camelCase
- Props Property : snake_case
### Constants et texts
Tous ce qui est constant et à écrire dans le code doit se retrouver au fichier suivant : 
```
src/utils/constants
```
### Traduction
Tout ce qui est de traduction doit se retrouver dans le fichier de traduction des langues
```
src/utils/i18n.js
```
il suffit d'accéder à l'objet t des props pour y accéder
```
 const {
      t,
    } = this.props;
    
 render() {
    <Text>{t('send_device_info')}</Text>
 } 
 
```
### Utils

## Flow types



Flow vérifie les types pour Javascript. Peut importe la fonction JS, on le Flow Type.

- On définit les types Props et State en dehors des méthodes.
- Propriétés de class pour le default Props et State

**Pour pouvoir utiliser Flow, il faut absolument importer react de la sorte :**
```js
import * as React from 'react';
```

### Statefull Components
```js
import * as React from 'react';

type Props = { 
  foo: number,
  bar?: string,
 };

type State = {
  count: number,
};

class MyComponent extends React.Component<Props, State> {
  state = {
    count: 0,
  };
  
  defaultProps = {
      bar: 'Hello', 
  };

  componentDidMount() {
    setInterval(() => {
      this.setState(prevState => ({
        count: prevState.count + 1,
      }));
    }, 1000);
  }

  render() {
    return <Text>Count: {this.state.count}</Text>;
  }
}

<MyComponent />;
```

### Functional Components

```js
import * as React from 'react';

type Props = {
  foo: number,
};

function MyComponent(props: Props) {}

MyComponent.defaultProps = {
  foo: 42, 
};

<MyComponent />;
```
### Types React navigation and traduction

```js
import type { I18nTypes } from '../../../utils/i18n';
import { NavigationScreenProps } from 'react-navigation';

type Props = NavigationScreenProps & {
  logged: boolean,
  t: I18nTypes,
  app: {
    authentication: (email: string, password: string) => void,
  },
};
```

### Advanced Flow

https://flow.org/en/docs/react/

```bash
npm run flow
```

4. [Tests](#)



