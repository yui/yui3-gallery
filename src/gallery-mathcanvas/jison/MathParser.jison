/* node `which jison` MathParser.jison; mv MathParser.js ../js/ */

/* http://zaach.github.com/jison/docs/ */

/* lexical grammar */
%lex

%%
"0"[xX][0-9a-fA-F]+						return 'NUMBER';	/* hex */
[0-9]+[eE][-+]?[0-9]+					return 'NUMBER';	/* integer w/ exponent */
[0-9]+"."([0-9]+)?([eE][-+]?[0-9]+)?	return 'NUMBER';	/* decimal w/ exponent */
([0-9]+)?"."[0-9]+([eE][-+]?[0-9]+)?	return 'NUMBER';	/* decimal w/ exponent */
[1-9][0-9]*								return 'NUMBER';	/* decimal integer */
"0"										return 'NUMBER';	/* zero */

"pi"		return 'PI';
"\u03c0"	return 'PI';
"e"			return 'E';
"i"			return 'I';

"*"	return '*';
"/"	return '/';
"-"	return '-';
"+"	return '+';
"^"	return '^';
"("	return '(';
")"	return ')';

","			return ',';
"re"		return 'RE';
"im"		return 'IM';
"abs"		return 'ABS';
"phase"		return 'PHASE';
"conjugate"	return 'CONJUGATE';
"rotate"	return 'ROTATE';
"max"		return 'MAX';
"min"		return 'MIN';
"sqrt"		return 'SQRT';
"log"		return 'LOG';
"log2"		return 'LOG2';
"log10"		return 'LOG10';
"ln"		return 'LN';
"arcsin"	return 'ARCSIN';
"arccos"	return 'ARCCOS';
"arctan"	return 'ARCTAN';
"arctan2"	return 'ARCTAN2';
"sin"		return 'SIN';
"cos"		return 'COS';
"tan"		return 'TAN';
"sinh"		return 'SINH';
"cosh"		return 'COSH';
"tanh"		return 'TANH';
"arcsinh"	return 'ARCSINH';
"arccosh"	return 'ARCCOSH';
"arctanh"	return 'ARCTANH';

[^-*/+^(),\s0-9][^-*/+^(),\s]*	return 'VARIABLE';

\s+		/* skip whitespace */
<<EOF>>	return 'EOF';

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expression

%% /* language grammar */

expression
	: e EOF
		{return $1;}
	;

e
	: NUMBER
		{$$ = new yy.MathFunction.Value(yytext);}
	| E
		{$$ = new yy.MathFunction.E();}
	| PI
		{$$ = new yy.MathFunction.Pi();}
	| I
		{$$ = new yy.MathFunction.I();}
	| VARIABLE
		{$$ = new yy.MathFunction.Variable(yytext);}

	| '(' e ')'
		{$$ = $2;}

	| e '+' e
		{$$ = yy.MathFunction.updateSum($1, $3);}
	| e '-' e
		{$$ = yy.MathFunction.updateSum($1, new yy.MathFunction.Negate($3));}
	| e '*' e
		{$$ = yy.MathFunction.updateProduct($1, $3);}
	| e '/' e
		{$$ = new yy.MathFunction.Quotient($1, $3);}
	| e '^' e
		{$$ = new yy.MathFunction.Exponential($1, $3);}
	| '-' e %prec UMINUS
		{$$ = new yy.MathFunction.Negate($2);}

	| ABS '(' e ')'
		{$$ = new yy.MathFunction.Magnitude($3);}
	| PHASE '(' e ')'
		{$$ = new yy.MathFunction.Phase($3);}
	| CONJUGATE '(' e ')'
		{$$ = new yy.MathFunction.Conjugate($3);}
	| ROTATE '(' arglist ')'
		{$$ = new yy.MathFunction.Rotate($3);}
	| RE '(' e ')'
		{$$ = new yy.MathFunction.RealPart($3);}
	| IM '(' e ')'
		{$$ = new yy.MathFunction.ImaginaryPart($3);}

	| MIN '(' arglist ')'
		{$$ = new yy.MathFunction.Min($3);}
	| MAX '(' arglist ')'
		{$$ = new yy.MathFunction.Max($3);}

	| SQRT '(' e ')'
		{$$ = new yy.MathFunction.SquareRoot($3);}

	| LOG '(' arglist ')'
		{$$ = new yy.MathFunction.Logarithm($3);}
	| LOG2 '(' e ')'
		{$$ = new yy.MathFunction.Logarithm(new yy.MathFunction.Value(2), $3);}
	| LOG10 '(' e ')'
		{$$ = new yy.MathFunction.Logarithm(new yy.MathFunction.Value(10), $3);}
	| LN '(' e ')'
		{$$ = new yy.MathFunction.NaturalLog($3);}

	| ARCSIN '(' e ')'
		{$$ = new yy.MathFunction.Arcsine($3);}
	| ARCCOS '(' e ')'
		{$$ = new yy.MathFunction.Arccosine($3);}
	| ARCTAN '(' e ')'
		{$$ = new yy.MathFunction.Arctangent($3);}
	| ARCTAN2 '(' arglist ')'
		{$$ = new yy.MathFunction.Arctangent2($3);}

	| SIN '(' e ')'
		{$$ = new yy.MathFunction.Sine($3);}
	| COS '(' e ')'
		{$$ = new yy.MathFunction.Cosine($3);}
	| TAN '(' e ')'
		{$$ = new yy.MathFunction.Tangent($3);}

	| SINH '(' e ')'
		{$$ = new yy.MathFunction.HyperbolicSine($3);}
	| COSH '(' e ')'
		{$$ = new yy.MathFunction.HyperbolicCosine($3);}
	| TANH '(' e ')'
		{$$ = new yy.MathFunction.HyperbolicTangent($3);}

	| ARCSINH '(' e ')'
		{$$ = new yy.MathFunction.InverseHyperbolicSine($3);}
	| ARCCOSH '(' e ')'
		{$$ = new yy.MathFunction.InverseHyperbolicCosine($3);}
	| ARCTANH '(' e ')'
		{$$ = new yy.MathFunction.InverseHyperbolicTangent($3);}
	;

arglist
	: e
		{$$ = [ $1 ];}
	| arglist ',' e
		{$$ = $1.concat($3);}
	;
