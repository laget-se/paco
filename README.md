# paco

Node package development/distribution utility kit.

Notes to self:

```bash
paco init
# ->

paco test

paco lint

paco build

paco verify
# -> test
# -> lint

paco prepare
# -> test
# -> lint
# -> build

paco release [bump]
# -> test
# -> lint
# -> build
# -> version bump
# -> commit
# -> push tags
# -> push

paco notes [--branch|--last-tag]
# ->
```
