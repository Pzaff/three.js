/**
 * Bezier Curves formulas obtained from
 * http://en.wikipedia.org/wiki/Bézier_curve
 */
import { Vector3 } from '../../math/Vector3';

function CatmullRom( t, p0, p1, p2, p3 ) {

	const v0 = ( p2 - p0 ) * 0.5;
	const v1 = ( p3 - p1 ) * 0.5;
	const t2 = t * t;
	const t3 = t * t2;
	return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

}

//

function QuadraticBezierP0( t, p ) {

	const k = 1 - t;
	return k * k * p;

}

function QuadraticBezierP1( t, p ) {

	return 2 * ( 1 - t ) * t * p;

}

function QuadraticBezierP2( t, p ) {

	return t * t * p;

}

function QuadraticBezier( t, p0, p1, p2 ) {

	return QuadraticBezierP0( t, p0 ) + QuadraticBezierP1( t, p1 ) +
		QuadraticBezierP2( t, p2 );

}

//

function CubicBezierP0( t, p ) {

	const k = 1 - t;
	return k * k * k * p;

}

function CubicBezierP1( t, p ) {

	const k = 1 - t;
	return 3 * k * k * t * p;

}

function CubicBezierP2( t, p ) {

	return 3 * ( 1 - t ) * t * t * p;

}

function CubicBezierP3( t, p ) {

	return t * t * t * p;

}

function CubicBezier( t, p0, p1, p2, p3 ) {

	return CubicBezierP0( t, p0 ) + CubicBezierP1( t, p1 ) + CubicBezierP2( t, p2 ) +
		CubicBezierP3( t, p3 );

}

// TODO: PDZ- in theory this should work just as well as the individual component function call. However, in reality, this one doesn't render. My hypothesis is that the .add() and .multiply scalar function calls are the issues.
function NDegreeBezier( t, controlPoints, binomialCoefficients ) {

	let evaluatedPoint = new Vector3( 0, 0, 0 );
	// the explicit bezier curve formula goes from 0 to n. I.E. for n = 3, there are 4 control points that enumerate as, 0, 1, 2, 3.
	const n = controlPoints.length - 1;
	for ( let i = 0; i < controlPoints.length; i ++ ) {

		evaluatedPoint = evaluatedPoint.add( controlPoints[ i ].multiplyScalar( binomialCoefficients[ i ] * Math.pow( t, i ) * Math.pow( ( 1 - t ), ( n - i ) ) ) );

	}

	return evaluatedPoint;

}

function NDegreeBezierIndividualComponent( t, controlPoints, binomialCoefficients ) {

	const intermediates = [];
	// the explicit bezier curve formula goes from 0 to n. I.E. for n = 3, there are 4 control points that enumerate as, 0, 1, 2, 3.
	const n = controlPoints.length - 1;
	for ( let i = 0; i < controlPoints.length; i ++ ) {

		intermediates[ i ] = binomialCoefficients[ i ] * Math.pow( t, i ) * Math.pow( ( 1 - t ), ( n - i ) ) * controlPoints[ i ];

	}

	return intermediates.reduce( ( a, b ) => a + b );

}

// //  TODO: PDZ- DON'T USE THIS. It locks up the browser with the number of recursive calls it has.
// function NDegreeBezierRecursiveIndividualComponent( t, controlPoints, current_point, degree ) {
//
// 	if ( degree === 0 ) {
//
// 		return controlPoints[ current_point ];
//
// 	} else {
//
// 		return ( NDegreeBezierRecursiveIndividualComponent( t, controlPoints, current_point, degree - 1 ) * NDegreeBezierRecursiveIndividualComponent( t, controlPoints, current ) * ( 1 - t ) ) + ( NDegreeBezierRecursiveIndividualComponent( t, controlPoints, current_point + 1, degree - 1 ) * t );
//
// 	}
//
// }

// TODO: PDZ- DON'T USE THIS. It locks up the browser with the number of recursive calls it has.
function NDegreeBezierRecursive( t, controlPoints, current_point, degree ) {

	if ( degree === 0 ) {

		return controlPoints[ current_point ];

	} else {

		const left = NDegreeBezierRecursive( t, controlPoints, current_point, degree - 1 ).multiplyScalar( 1 - t );
		const right = NDegreeBezierRecursive( t, controlPoints, current_point + 1, degree - 1 ).multiplyScalar( t );
		return ( left ).add( right );

	}

}

export { CatmullRom, QuadraticBezier, CubicBezier, NDegreeBezier, NDegreeBezierIndividualComponent, NDegreeBezierRecursive };
