//Create slider that supports an array of possible values
Y.ArraySlider = Y.Base.build( 'slider', Y.SliderTickBase,
	[ Y.SliderArrayRange, Y.ClickableRail ] );