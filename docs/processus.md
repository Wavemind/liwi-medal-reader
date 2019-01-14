---
title: Processus
---

Need to be writen


## 1. Style
Il y a 3 maniéres de styliser un composants

### 1.1 Simple style
Ajouter une propriété directement dans le composant Native Base
```
src/template/liwi/styles/
```
On définit le template puis le composant : "NativeBase.Button"
Ajouter une propriété directement à NativeBase.Button affectera tout les boutons du projet
````
'NativeBase.Button': {
    '.btnLiwi': {
      height: 70,
      backgroundColor: '#ff31d0',
      borderRadius: 35,
    },
    // Tous les buttons sont affectés !
    margin: 10,
  },
````
Puis pour appeler ce style 
````
<Button btnLiwi>
    <Text>Primary</Text>
</Button>
````
### 1.2 Composant  avec style spécifique stateless
 Créer un composant styled
````
src/template/liwi/layout.js
````
on export une copie du composant souhaité
````react
export const TextExemple = styled(LText).attrs({
    margin: 20
})`
  color: #4e4e4e;
  font-family: roboto;
  font-weight: bold;
`;

````
### 1.3 Composnants statefull
Pour un composant spécifique statefull on préfére mettre les styles dans le dossiers courant

## 2. Store

### 2.1 React Contexts 
### 2.2 Redux

## 3. Flow
## 5. Import
Relative path


