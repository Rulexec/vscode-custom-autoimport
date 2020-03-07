Custom AutoImport
=================

Settings example:

```
{
	"customAutoImport": {
		"imports": {
			"_": "lodash",
			"MySomething": "@myprefix/mylib/something"
		}
	}
}
```

Then, autocomplete will offer to autoimport `lodash` as `_`.

Currently, autoimport just inserts string like:

```
import MySomething from '@myprefix/mylib/something';
```

to the top of file.

It is enough for me, but I'm open for issues.