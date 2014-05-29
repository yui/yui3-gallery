# Change History

## @NEXT@


## 1.0.2 (2014-04-07)

- workaround for `express-yui` bug where `gallery-` prefix causes extended core
  to load as gallery module (https://github.com/yahoo/express-yui/issues/58)


## 1.0.1 (2014-04-04)

- optional trailing slash for customComboBase
- print combo url count only when required


## 1.0.0 (2014-03-21)

- uses `core`, `gallery`, and `shifter` module groups for lossy compression
- uses anonymous `fullpath` module group for everything else
- deprecated `path` and `root` module groups
- breaks compatibility with previous versions of yui-combo-middleware@1.0.0


## 0.1.3 (2013-11-26)

Changes:

- Enable root config support for `path` module groups


## 0.1.2 (2013-10-17)

Changes:

- Fix "JSON is undefined" error

Available:

- [gallery][]: gallery-2013.10.17-22-20

## 0.1.1 (2013-10-16)

Changes:

- Enable the fullpath prefix tree compression with the `fullpathCompression` config


[gallery]: https://github.com/yui/yui3-gallery/tree/master/build/gallery-pathogen-encoder
