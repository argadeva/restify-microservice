const pgConnection = require("./connection");
const wrapper = require("../../utils/wrapper");
const errorQueryMessage = "Error querying PostgreSQL";
const errorEmptyMessage = "Data Not Found Please Try Another Input";
const ctx = "Database.PostgreSQL";

class DB {
  constructor(pgConfig) {
    this.pgConfig = pgConfig;
  }

  async executeQuery(query, values) {
    try {
      const getDatabase = await pgConnection.getConnection(this.pgConfig);
      const result = await getDatabase.query(query, values);
      return result;
    } catch (err) {
      console.error(ctx, errorQueryMessage, "executeQuery", err);
      return null;
    }
  }

  async findOne(
    parameter,
    projection,
    collectionName,
    isDeleted = false,
    timescope = false,
  ) {
    try {
      const projectionKeys = Object.keys(projection);
      const parameterKey = Object.keys(parameter);
      const projectionPlaceholders = projectionKeys
        .map((key) => `"${collectionName}"."${key}"`)
        .join(", ");
      const parameterPlaceholders = parameterKey
        .map((key, index) => `"${collectionName}"."${key}" = $${index + 1}`)
        .join(" AND ");
      const deleted = isDeleted
        ? `AND "${collectionName}"."deleted_at" IS NULL`
        : "";
      const time = timescope
        ? `AND "${collectionName}"."${timescope.column}" BETWEEN '${timescope.start}' AND '${timescope.end}'`
        : "";
      const query = `
        SELECT ${projectionPlaceholders}
        FROM "${collectionName}"
        WHERE ${parameterPlaceholders} ${deleted} ${time}
        LIMIT 1;
      `;
      const values = parameterKey.map((key) => parameter[key]);
      const result = await this.executeQuery(query, values);
      if (!result || result.rows.length === 0) {
        return wrapper.error(errorEmptyMessage);
      }
      return wrapper.data(result.rows[0]);
    } catch (err) {
      console.error(ctx, errorQueryMessage, "findOne", err);
      return wrapper.error(errorQueryMessage);
    }
  }

  async insertOne(document, collectionName) {
    try {
      const keys = Object.keys(document);
      const values = Object.values(document);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
      const projectionPlaceholders = keys.map((key) => `"${key}"`).join(", ");
      const query = `
        INSERT INTO "${collectionName}" (${projectionPlaceholders})
        VALUES (${placeholders})
        RETURNING *;
      `;
      const result = await this.executeQuery(query, values);
      if (!result || result.rows.length === 0) {
        return wrapper.error(errorQueryMessage);
      }
      return wrapper.data(result.rows[0]);
    } catch (err) {
      console.error(ctx, errorQueryMessage, "insertOne", err);
      return wrapper.error(errorQueryMessage);
    }
  }

  async updateOne(parameter, updateQuery, collectionName) {
    try {
      const updateQueryKey = Object.keys(updateQuery);
      const parameterKey = Object.keys(parameter);
      const updateQueryKeyPlaceholders = updateQueryKey
        .map((key) => `"${key}" = '${updateQuery[key]}'`)
        .join(", ");
      const parameterPlaceholders = parameterKey
        .map((key, index) => `"${key}" = $${index + 1}`)
        .join(" AND ");
      const query = `
        UPDATE "${collectionName}"
        SET ${updateQueryKeyPlaceholders}
        WHERE ${parameterPlaceholders}
        RETURNING *;
      `;
      const values = parameterKey.map((key) => parameter[key]);
      const result = await this.executeQuery(query, values);
      if (!result || result.rows.length === 0) {
        return wrapper.error(errorEmptyMessage);
      }
      return wrapper.data(result.rows[0]);
    } catch (err) {
      console.error(ctx, errorQueryMessage, "updateOne", err);
      return wrapper.error(errorQueryMessage);
    }
  }

  async findAll(
    projection,
    sort,
    page,
    limit,
    collectionName,
    isDeleted = false,
    timescope = false,
  ) {
    try {
      const projectionKeys = Object.keys(projection);
      const projectionPlaceholders = projectionKeys
        .map((key) => `"${collectionName}"."${key}"`)
        .join(", ");
      const sortingPlaceholders = Object.keys(sort)
        .map((key) => `"${collectionName}"."${key}"`)
        .join(", ");
      const offset = limit * (page - 1);
      const deleted = isDeleted
        ? `"${collectionName}"."deleted_at" IS NULL`
        : "";
      const time = timescope
        ? `"${collectionName}"."${timescope.column}" BETWEEN '${timescope.start}' AND '${timescope.end}'`
        : "";
      const isTimescopeOrDeleted =
        timescope || isDeleted ? `WHERE ${deleted} ${time}` : "";
      const query = `
        SELECT ${projectionPlaceholders}
        FROM "${collectionName}"
        ${isTimescopeOrDeleted}
        ORDER BY ${sortingPlaceholders} 
        LIMIT ${limit} OFFSET ${offset};
      `;
      const result = await this.executeQuery(query);
      if (!result || result.rows.length === 0) {
        return wrapper.error(errorEmptyMessage);
      }
      return wrapper.data(result.rows);
    } catch (err) {
      console.error(ctx, errorQueryMessage, "findAll", err);
      return wrapper.error(errorQueryMessage);
    }
  }

  async deleteOne(parameter, collectionName) {
    try {
      const parameterKey = Object.keys(parameter);
      const parameterPlaceholders = parameterKey
        .map((key, index) => `"${collectionName}"."${key}" = $${index + 1}`)
        .join(" AND ");
      const query = `
        DELETE FROM "${collectionName}"
        WHERE ${parameterPlaceholders}
      `;
      const values = parameterKey.map((key) => parameter[key]);
      const result = await this.executeQuery(query, values);
      if (!result || result.rowsCount === 0) {
        return wrapper.error(errorEmptyMessage);
      }
      return wrapper.data(result.rows[0]);
    } catch (err) {
      console.error(ctx, errorQueryMessage, "deleteOne", err);
      return wrapper.error(errorQueryMessage);
    }
  }
}

module.exports = DB;
