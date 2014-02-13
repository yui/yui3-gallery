
all: bin doc

doc:
	selleck
	yuidoc js -o build_docs/api/ -t docs/yuidoc-theme -c docs/yuidoc.json

bin: js/TreeView.js js/CheckBoxTreeView.js
	ant all

.PHONY: doc
