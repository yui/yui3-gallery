mkdir ractive-tmp;
curl http://cdn.ractivejs.org/edge/ractive.js -o ractive-tmp/ractive.js; 
cp ractive-tmp/ractive.js js/ractive.js;
cd ../../;
grunt uglify:ractive;
cd src/gallery-y-common-ractive;
rm -r ractive-tmp;

