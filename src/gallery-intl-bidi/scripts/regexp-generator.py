#!/usr/bin/env python

# This script downloads the latest Unicode character property file for bidi classes
# and generates two PHP regular expressions:
# 1) first matching all characters of class 'R' and 'AL';
# 2) the second matching all characters of any class except 'L', 'R', or 'AL'.

import sys
import urllib

# Converts a byte-value to an escaped regular expression,
# to keep PHP source files in ASCII.
# '0' becomes '\\x30'.
def escape_byte(byte):
  return '\\x%02x' % ord(byte)

def escape_word(word):
  return '\\u%04X' % word

# Like escape_byte, instead that it converts a byte sequence.
# '01' becomes '\\x31\\x32.
def escape_byteseq(byteseq):
  return ''.join([escape_byte(byte) for byte in byteseq])

# Generates a regular expression for a set of bytes.
# Get a set of bytes and create a regular expression
# based on it.
# set(['0']) becomes '\\x30', and
# set(['0', '1', '3, '4', '5']) becomes '[\\x30\\x31\\x33-\\x35]'
def escape_wordset(input_set):
  wordset = set(input_set)
  return_list = []
  while wordset != set([]):
    first = min(wordset)
    last = first+1
    while last in wordset:
      last += 1
    last -= 1
    if last in [first, first+1]: # if last == first+1, we don't want to waste an additional hyphen
      wordset.discard(first)
      return_list.append(escape_word(first))
    else:
      wordset -= frozenset(range(first, last+1))
      return_list.append(escape_word(first)+'-'+escape_word(last))

  if len(input_set) == 1: # don't put sets of one byte in brackets. note that we check the length of original set
    return return_list[0]
  else:
    return '[' + (''.join(return_list)) + ']'
      

def possibly_parenthesize(regexp):
  if '|' in regexp:
    return '('+regexp+')'
  else:
    return regexp


# Takes a set or list of strings and creates a short regular expression
# matching any of them. The regular expression will be escaped. The
# optimization technique assumes that a lot of these characters appear in
# blocks near each other.
# ['01', '07', '11', '17'] becomes '[\\x30\\x31][\\x31\\x37]'
def regexp_from_string_set(string_set):
  string_set = set(string_set)

  # The empty string is handled differently
  if () in string_set:
    string_set.remove(())
    if string_set == set([]):
      return ''
    else:
      empty_string_is_included = True
  else:
    empty_string_is_included = False
  
  final_char_dict = {}
  for string in string_set:
    prefix = string[:-1]
    final_char = string[-1]
    try:
      final_char_dict[prefix].add(final_char)
    except KeyError:
      final_char_dict[prefix] = set([final_char])
  
  # convert values to regexps so we can do indexes on them and also use them later as is
  final_char_dict = dict([(prefix, escape_wordset(final_char_dict[prefix])) for prefix in final_char_dict])
  
  final_char_values = set(final_char_dict.values())
  
  return_list = []
  for final_char_set in final_char_values:
    prefix_string_set = [prefix for prefix in final_char_dict if final_char_dict[prefix] == final_char_set]
    prefix_regexp = regexp_from_string_set(prefix_string_set)
    return_list.append(possibly_parenthesize(prefix_regexp)+final_char_set)

  joined_string = '|'.join(return_list)
  
  if empty_string_is_included:
    return '('+joined_string+')?'
  else:
    return joined_string

#assert (regexp_from_string_set(['01', '07', '11', '17']) == '[\\x30\\x31][\\x31\\x37]')


def to_utf16_tuple(codepoint):
  utf16_string = unichr(codepoint).encode('UTF-16BE')
  ret_tuple = ()
  for word_index in range(len(utf16_string)/2):
    first_index, second_index = word_index*2, word_index*2+1
    ret_tuple += (ord(utf16_string[first_index])*256+ord(utf16_string[second_index]),)
  return ret_tuple

# Takes a set of Unicode codepoints and generates a JavaSctip regular expression
# matching them.
def regexp_from_codepoint_set(codepoints):
  string_set = [to_utf16_tuple(codepoint) for codepoint in codepoints]
  return regexp_from_string_set(string_set)

assert (regexp_from_codepoint_set(range(0x067E, 0x0683)) == '[\\u067E-\\u0682]')


def set_bidi_type(bidi_set, range_beg, range_end, biditype):
  if biditype == 'L':
    target = 'L'
  elif biditype in ['R', 'AL']:
    target = 'R'
  else:
    target = 'N'

  bidi_set[target] |= set(range(range_beg, range_end+1))


def parse_input():
  return_set = {
    'L': set([]), # Bidi_Class == 'L'
    'R': set([]), # Bidi_Class in ['R', 'AL']
    'N': set([]), # None (other classes)
  }

  urllib.urlretrieve(
    'http://unicode.org/Public/UNIDATA/extracted/DerivedBidiClass.txt',
    'DerivedBidiClass.txt')
  bidi_data_file = open('DerivedBidiClass.txt', 'r')
  for line in bidi_data_file:
    # remove comments and skip empty lines
    if '#' in line:
      line = line[:line.index('#')]
    line = line.strip()
    if line == '':
      continue
    
    bidirange, biditype = line.split(';')
    bidirange = bidirange.strip()
    biditype = biditype.strip()

    if bidirange.find('..') != -1:
      range_beg, range_end = [int(num, 16) for num in bidirange.split('..')]
    else:
      range_beg = range_end = int(bidirange, 16)

    set_bidi_type(return_set, range_beg, range_end, biditype)

  bidi_data_file.close()
  return return_set


bidi_set = parse_input()
for key in ['R', 'N']:
  print key, regexp_from_codepoint_set(bidi_set[key])
  print

# Note that U+FEFF (BOM) is intentionally excluded
rtl_superset = range(0x0590, 0x08FF+1)+\
               [0x200F]+\
               range(0xFB1D, 0xFDFF+1)+\
               range(0xFE70, 0xFEFE+1)+\
               range(0x10800, 0x10FFF+1)+\
               range(0x1E800, 0x1EFFF+1)
assert(bidi_set['R'].issubset(rtl_superset))

print 'superset', regexp_from_codepoint_set(rtl_superset)
