import { Client as ClientPG, ClientConfig, QueryResult } from 'pg';

export default class PostgresDB {
  private clientPG: ClientPG;

  constructor(config: ClientConfig) {
    this.clientPG = new ClientPG(config);
  }

  async connect(): Promise<void> {
    try {
      await this.clientPG.connect();
      console.log('Connected to PostgreSQL database');
    } catch (error) {
      console.error('Failed to connect to PostgreSQL database', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.clientPG.end();
      console.log('Disconnected from PostgreSQL database');
    } catch (error) {
      console.error('Failed to disconnect from PostgreSQL database', error);
      throw error;
    }
  }

  async query(queryText: string, params?: any[]): Promise<QueryResult<any>> {
    try {
      const result = await this.clientPG.query(queryText, params);
      return result;
    } catch (error) {
      console.error('Failed to execute query', error);
      throw error;
    }
  }

  async createTable(
    tableName: string,
    columns: { [key: string]: string },
  ): Promise<void> {
    const columnsDef = Object.entries(columns)
      .map(([columnName, columnType]) => `${columnName} ${columnType}`)
      .join(', ');

    const createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnsDef});`;

    try {
      await this.query(createTableQuery);
      console.log(`Table ${tableName} created successfully`);
    } catch (error) {
      console.error(`Failed to create table ${tableName}`, error);
      throw error;
    }
  }

  async deleteTable(tableName: string): Promise<void> {
    const deleteTableQuery = `DROP TABLE IF EXISTS ${tableName};`;

    try {
      await this.query(deleteTableQuery);
      console.log(`Table ${tableName} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete table ${tableName}`, error);
      throw error;
    }
  }
}
