* Implement `import { something } from 'some-module';`
* Implement more smart import insertion (currently it prepends to the start of the file)
* Rewrite imports parsing to use AST, not a regexps?
* Remove imports parsing limit (currently it's 16 first lines)
* Remove TypeScript, I picked it from Hello, World extension example, but I don't like it
