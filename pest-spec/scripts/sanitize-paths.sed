# Normalize absolute paths to PWD token
s#/[^ ]*#PWD#g
# Collapse variable error details to stable messages
s#Error: Mapped local file not found: .*#Error: Mapped local file not found#g
s#Error: Resolved path escapes mapping root: .*#Error: Resolved path escapes mapping root#g
