#!/bin/sh



# The location of your yuidoc install
yuidoc_home=/Applications/yuidoc;

proj_label='timepicker';

mkdir -p doctmp/{parsertmp,docs};
mkdir $proj_label-docs;



# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.  You can specify multiple
# source trees:
#     parser_in="%HOME/www/yahoo.dev/src/js %HOME/www/Event.dev/src"
parser_in="../../src/gallery-$proj_label";

# The location to output the parser data.  This output is a file containing a 
# json string, and copies of the parsed files.
parser_out=doctmp/parsertmp;

# The directory to put the html file outputted by the generator
generator_out=doctmp/docs;

# The location of the template files.  Any subdirectories here will be copied
# verbatim to the destination directory.
template='/Applications/yuidoc/template/';

projectname='YUI Doc Demo'
version="0.0.1"

yuiversion="3.0.0"

##############################################################################
# add -s to the end of the line to show items marked private

$yuidoc_home/bin/yuidoc.py $parser_in -p $parser_out -o $generator_out -t $template -m 'YUI Doc Demo' -Y $yuiversion -v $version -u 'http://developer.yahoo.com';

#copy it to the right place
cp -r doctmp/docs/* $proj_label-docs/

#clean out temp files
rm -r doctmp
