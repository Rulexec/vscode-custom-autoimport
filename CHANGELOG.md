# vscode-custom-autoimport

# 0.1.1

-   Support for `"{ nameA, nameB }": "module-name"` in the config (multiple imports)
-   Fixed imports parsing (there was problem with non-default imports on second line+)

# 0.1.0

-   Support for `import { exportName, exportName as _alias } from 'module-name'`.
-   Prefix-search replaced with trigrams search (suggestion should contain at least
    one three-symbol match, instead of prefix match)
-   Prototype of imports parsing added, fixed multiple import addition
    (TODO: parse more than first 16 lines)

# 0.0.3

Initial release
