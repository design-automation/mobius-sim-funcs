# mobius-sim-funcs
This library is part of the [Möbius Ecosystem](https://mobius.design-automation.net/index.html).
The Möbius Ecosystem encompasses various open-source tools and libraries for supporting spatial computational thinking. 
At the core of this ecosystem is Möbius Modeller, a parametric modelling application for the web.

mobius-sim-funcs provides the main functions used when coding in Mobius, sorted into several categories.

For more resources on embedding Mobius: https://mobius.design-automation.net/pages/mobius_for_your_site.html

## Documentation
[Github Link](documentation/index.md)

[Website](https://design-automation.github.io/mobius-sim-funcs/)

## Example codes
[Link](examples/index.md)

## Installation and usage 

Mobius functions can be integrated into javascript or typescript projects. 
Typescript can give tips/auto-suggestions on the existing functions,
while javascript can show you the full documentation of each module. 
**Note**: Different editors may show different results. For **javascript**, 
beware that the `__model__` argument is **not required** for any functions. 

To setup a typescript project: 
1. Setup the Javascript/Typescript folder. `cd` to the folder. 
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
You can customize the import and constant names.
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
node test.js
```


