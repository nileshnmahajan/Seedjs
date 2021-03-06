var REG = require( './REG' );

/**
 * 附加参数
 *
 * @param {String} url url
 * @param {String} query 参数
 * @returns {String} 修正后的参数
 */
module.exports = function ( url, query ) {
    return (query === '') ? url : (url + '&' + query).replace( REG.URL_OPERATOR, '?' );
};