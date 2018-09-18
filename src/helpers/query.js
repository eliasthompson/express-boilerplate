const _ = require('lodash');
const Sequelize = require('sequelize');
const errors = require('common-errors');

/* Wrapper for database column errors */
const QueryError = errors.helpers.generateClass('QueryError', {
  generateMessage: () => 'Invalid properties in query string',
});

module.exports = {
  convertToArray(data) {
    if (_.isString(data)) {
      return _.map(data.split(','), d => d.trim());
    }

    return data;
  },

  /**
   * Build the attributes array from a URL string
   * @param {string} attributes
   * @return {array}
   */
  parseAttributes(attributes) {
    if (_.isArray(attributes)) {
      return attributes;
    }

    if (!_.isUndefined(attributes) && !_.isNull(attributes)) {
      const parsedAttributes = _.split(attributes, ',');
      return parsedAttributes.map(v => v.trim());
    }

    return null;
  },

  /**
   * Build the includes array from a URL string
   * @param {string} joins
   * @param {string} availableJoins
   * @return {array}
   */
  parseInclude(joins, availableJoins = {}) {
    return _.map(joins, (value, key) => {
      if (_.isFunction(availableJoins[key])) {
        return availableJoins[key](value);
      }

      return null;
    }).filter(Boolean);
  },

  /**
   * Build the order array from a URL string
   * @param {string} order
   * @return {array}
   */
  parseOrder(order) {
    if (_.isUndefined(order)) return null;

    if (_.startsWith(order, 'raw:')) {
      return Sequelize.literal(_.replace(order, 'raw:', ''));
    }

    const parsedSort = _.split(order, ',');

    const sorts = parsedSort.map((v) => {
      const trimmed = v.trim();

      if (trimmed.charAt(0) === '-') {
        return `"${trimmed.substr(1)}" DESC`;
      }

      return `"${trimmed}" ASC`;
    });

    return Sequelize.literal(_.join(sorts, ','));
  },

  /**
   * Build the where object from a URL string
   * @param {string} where
   * @param {object} keyMap
   * @return {array}
   */
  parseWhere(where, keyMap = {}) {
    if (_.isUndefined(where)) return {};

    return _.transform(where, (result, value, key) => {
      const newKey = keyMap[key] || key;
      result[newKey] = value; // eslint-disable-line no-param-reassign
    });
  },

  /**
   * @param {string} subQuery
   * @return {boolean}
   */
  parseSubQuery(subQuery) {
    if (_.isUndefined(subQuery)) return true;
    if (subQuery === 'false') return false;

    return subQuery;
  },

  /**
   * Returns the limit
   * @param {string} limit
   * @return {integer|null}
   */
  calculateLimit(limit) {
    if (_.isUndefined(limit)) return 10;
    if (_.toInteger(limit) === -1) return null;
    return limit;
  },

  /**
   * Build the conditions object from the request body
   * @param {string} options
   * @param {string} availableJoins
   * @param {string} keyMap
   * @return {array}
   */
  buildQuery(options, availableJoins, keyMap) {
    return {
      attributes: this.parseAttributes(options.attributes),
      include: this.parseInclude(options.join, availableJoins),
      limit: this.calculateLimit(options.limit),
      offset: options.offset || 0,
      order: this.parseOrder(options.order),
      where: this.parseWhere(options.where, keyMap),
      subQuery: this.parseSubQuery(options.subQuery),
      paranoid: options.paranoid || true,
    };
  },

  errorWrapper(e) {
    const message = _.get(e, 'parent.message');
    if (!/column.+does not exist/.test(message)) throw e;
    throw new QueryError();
  },

  QueryError,
};
