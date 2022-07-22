# mobius-sim-funcs
This library is part of the [Möbius Ecosystem](https://mobius.design-automation.net/index.html).
The Möbius Ecosystem encompasses various open-source tools and libraries for supporting spatial computational thinking. 
At the core of this ecosystem is Möbius Modeller, a parametric modelling application for the web.

The mobius-sim-funcs library provides the main modelling functions for creating scripts that generate Mobius models. 

The models generated by these script can be exported in the SIM format, and can then be loaded in either Mobius Modeller or in Mobius Viewer. For more information on embedding Mobius Modeller or Mobius Viewer in your website: 

- [Mobius for Your Site]([https://design-automation.github.io/mobius-sim-funcs/](https://mobius.design-automation.net/pages/mobius_for_your_site.html))

## API Documentation

- [API Documentation](https://design-automation.github.io/mobius-sim-funcs/)

## Installation and usage 

Mobius functions can be integrated into javascript or typescript projects. 
Typescript can give tips/auto-suggestions on the existing functions,
while javascript can show you the full documentation of each module. 
**Note**: Different editors may show different results. 

To install mobius-sim-funcs:
```
npm i @design-automation/mobius-sim-funcs
```

## Creating a Javascript Project

To setup a typescript project: 
1. Setup the Project folder. `cd` to the folder. 
2. Run the following to setup `package.json`:
```
npm init
```
3. Install mobius-sim-funcs:
```
npm i @design-automation/mobius-sim-funcs
```
4. Create a .js file (e.g. `test.js`) with the following contents:
```
const Funcs = require("@design-automation/mobius-sim-funcs");
const sf = new Funcs.SIMFuncs();
```
You can then write code with the Mobius functions.
For example:
```
const posis = sf.pattern.Rectangle([0,0,0],5);
const pgon = sf.make.Polygon(posis);
console.log('polygons: ' + pgon);
```
5. Then run the file:
```
node test.js
```

## Creating a Typescript Project

To setup a typescript project: 
1. Setup the Project folder. `cd` to the folder. 
2. Run the following to setup `package.json`:
```
npm init
```
3. Install typescript with save-dev:
```
npm i --save-dev typescript
```
4. Create a `tsconfig.json` file with tsc:
```
npx tsc -init
```

Using `mobius-sim-funcs`:

5. Install mobius-sim-funcs:
```
npm i @design-automation/mobius-sim-funcs
```
6. Create a .ts file (e.g. `test.ts`) with the following contents:
```
import * as Funcs from '@design-automation/mobius-sim-funcs'
const sf = new Funcs.SIMFuncs()
```
You can then write code with the Mobius functions.
For example:
```
const posis = sf.pattern.Rectangle([0,0,0],5)
const pgon = sf.make.Polygon(posis)
console.log('polygons: ' + pgon)
```
7. **Everytime** you make an update, recompile by entering:
```
npx tsc
```
8. Then run the compiled file:
```
node test.ts
```


