import { Curve } from '../core/Curve.js';
import { NDegreeBezier, NDegreeBezierIndividualComponent, NDegreeBezierRecursive } from '../core/Interpolations.js';
import { Vector3 } from '../../math/Vector3.js';

// TODO: PDZ- this isn't working at the moment.
// const BezierEvaluator = {
// 	RECURSIVE: 'RECURSIVE',
// 	DIRECT: 'DIRECT'
// };


class NDegreeBezierCurve3 extends Curve {

	// prime the first two rows for the coefficients
	static _pascalsTriangle = [[ 1 ], [ 1, 1 ]];

	static _getBinomialCoefficients( n ) {

		if ( n <= 0 ) {

			return [];

		}

		if ( this._pascalsTriangle.length <= n ) {

			for ( let i = this._pascalsTriangle.length; i <= n; i ++ ) {

				if ( i >= 2 ) {

					const coefficients = [];
					const previousCoefficientRow = this._pascalsTriangle[ i - 1 ];

					// Don't go to the end since we don't want to attempt to index beyond the end of the previous coefficients array
					for ( let j = 0; j < previousCoefficientRow.length; j ++ ) {

						if ( j === 0 ) {

							coefficients[ j ] = 1;

						} else {

							coefficients[ j ] = previousCoefficientRow[ j - 1 ] + previousCoefficientRow[ j ];

						}

					}

					// The last coefficient of the binomial tree will always be 1
					coefficients[ coefficients.length ] = 1;
					this._pascalsTriangle[ i ] = coefficients;

				}

			}

		}

		// subtract 1 to adjust for 0 start index
		return this._pascalsTriangle[ n ];

	}

	/**
	 *
	 * @param controlPoints an array of Vector3 which are the control points for the n-degree Bézier curve.
	 */
	constructor( controlPoints ) {

		super();

		this.type = 'NDegreeBezierCurve3';

		this.controlPoints = controlPoints;
		this.controlPointsX = this.controlPoints.map( vec => vec.x );
		this.controlPointsY = this.controlPoints.map( vec => vec.y );
		this.controlPointsZ = this.controlPoints.map( vec => vec.z );

		this.binomialCoefficients = NDegreeBezierCurve3._getBinomialCoefficients( controlPoints.length - 1 );

	}

	getPoint( t, optionalTarget = new Vector3() ) {

		const point = optionalTarget;

		// const degree = this.controlPoints.length - 1;
		// const bezier_point = this.evaluator === BezierEvaluator.RECURSIVE ? NDegreeBezierRecursive( t, this.controlPoints, 0, degree ) : NDegreeBezier( t, this.controlPoints, this.binomialCoefficients );
		// point.set( bezier_point.x, bezier_point.y, bezier_point.z );
		const xPoint = NDegreeBezierIndividualComponent( t, this.controlPointsX, this.binomialCoefficients );
		const yPoint = NDegreeBezierIndividualComponent( t, this.controlPointsY, this.binomialCoefficients );
		const zPoint = NDegreeBezierIndividualComponent( t, this.controlPointsZ, this.binomialCoefficients );

		point.set( xPoint, yPoint, zPoint );

		return point;

	}

	/**
	 * Subdivides the curve into the balance. If balance = 0.5, then it will be subdivided by the midpoint.
	 */
	subdivide( balance ) {

		let interimPoints = this.controlPoints;
		const firstIntervalControlPoints = [];
		const secondIntervalControlPoints = [];

		// Add the starting and ending points of this curve.
		firstIntervalControlPoints.push( this.controlPoints[ 0 ] );
		secondIntervalControlPoints.push( this.controlPoints[ this.controlPoints.length - 1 ] );

		while ( interimPoints.length > 1 ) {

			const newInterimPoints = [];

			// Iterate over all the current interim points to find the new internal points.
			for ( let i = 0; i < interimPoints.length - 1; i ++ ) {

				const internalPt = this._findInterimPoint( interimPoints[ i ], interimPoints[ i + 1 ], balance );
				newInterimPoints.push( internalPt );

				// The only internal points we care about are the first and last of each iteration
				if ( i === 0 ) {

					firstIntervalControlPoints.push( internalPt );

				}

				if ( i === interimPoints.length - 2 ) {

					secondIntervalControlPoints.push( internalPt );

				}

			}

			interimPoints = newInterimPoints;

		}

		// Reverse the second one since we built it backwards (last point to first)
		return [ new NDegreeBezierCurve3( firstIntervalControlPoints ), new NDegreeBezierCurve3( secondIntervalControlPoints.reverse() ) ];

	}

	/**
	 * Find the interim point between two control points. The balance, which is number between (0, 1), is how close
	 * to one control point vs the other the interim point lives. For example, if balance = 0.5 the midpoint will be
	 * found between the two control points. If it is 0.75, then the interim point is 75% of the way to control point
	 * 2 when moving from control point 1 to control point 2.
	 */
	_findInterimPoint( controlPoint1, controlPoint2, balance ) {

		const midpointX = controlPoint1.x + ( controlPoint2.x - controlPoint1.x ) / balance;
		const midpointY = controlPoint1.y + ( controlPoint2.y - controlPoint1.y ) / balance;
		const midpointZ = controlPoint1.z + ( controlPoint2.z - controlPoint1.z ) / balance;

		return new Vector3( midpointX, midpointY, midpointZ );

	}

	copy( source ) {

		super.copy( source );

		this.controlPoints.copy( source.controlPoints );
		this.controlPointsX.copy( source.controlPointsX );
		this.controlPointsY.copy( source.controlPointsY );
		this.controlPointsZ.copy( source.controlPointsZ );
		this.binomialCoefficients.copy( source.binomialCoefficients );

		return this;

	}

	toJSON() {

		const data = super.toJSON();

		data.controlPoints = this.controlPoints.toArray();

		return data;

	}

	fromJSON( json ) {

		super.fromJSON( json );

		this.controlPoints( json.controlPoints );
		this.controlPointsX = this.controlPoints.map( vec => vec.x );
		this.controlPointsY = this.controlPoints.map( vec => vec.y );
		this.controlPointsZ = this.controlPoints.map( vec => vec.z );

		return this;

	}

}

NDegreeBezierCurve3.prototype.isNDegreeBezierCurve3 = true;

export { NDegreeBezierCurve3 };
