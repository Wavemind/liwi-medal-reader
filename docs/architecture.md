Architecture
----------


### 1. Files

- assets
- docs -> _Fichiers Markdown qui composent la documentation technique du projet_
- docusaurus -> _Package qui permet de servir un webservice de documentation_
- src -> **Source des fichiers React / JS du projet**
    - components -> _Tout composants React qui n'est pas une vue_
    - engine -> _Contient tous les composants intelligent_
        - actions
        - api
        - contexts
        - middlewares
        - navigation
        - reducers
        - selectors
        - traduction
        - store.js
    - screens
    - template
        - liwi
            - native_composants -> _Natif à native base_
            - styles -> _Style personnalisé du template Native Base_
            - variables
        - layout.js
        - Layout.template.js
    - utils -> _Différents utilitaires_
- type-libs
