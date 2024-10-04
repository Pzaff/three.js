When you make changes to this project you need to regenerate the module and the types associated to the module. To do that
run: 
`npm run build`
and 
`tsc --declaration`

The first will build the module and the second produces the types declarations (*.d.ts files).

When adding a new class you need to add the export to `./src/Three.js` and the `index.d.ts` file. See `ParametricGeometry` class as an example.
