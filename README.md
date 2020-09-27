# Custom AutoImport

Settings example:

```
{
	"customAutoImport": {
		"imports": {
			"_": "lodash",
			"{ flatMap }": "lodash",
			"{ filter as _filter }": "lodash",
			"MySomething": "@myprefix/mylib/something"
		}
	}
}
```

Then, autocomplete will offer to autoimport `lodash` as `_`,
or `_filter` as alias to `filter` from `lodash`.

Currently, autoimport just inserts string like:

```
import MySomething from '@myprefix/mylib/something';
```

to the top of file and tries to add `{ nonDefault }` to the existing import.

It is enough for me, but I'm open for issues.
