import { Curve } from '../core/Curve.js';
import { NDegreeBezier } from '../core/Interpolations.js';
import { Vector3 } from '../../math/Vector3.js';


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
	 * @param controlPoints an array of Vector3 which are the control points for the n-degree Bezier Curve.
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

		point.set(
			NDegreeBezier( t, this.controlPointsX, this.binomialCoefficients ),
			NDegreeBezier( t, this.controlPointsY, this.binomialCoefficients ),
			NDegreeBezier( t, this.controlPointsZ, this.binomialCoefficients )
		);

		return point;

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
