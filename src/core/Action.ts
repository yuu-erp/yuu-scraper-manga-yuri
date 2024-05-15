import { Keys } from '../types/utils';
import chunk from 'lodash/chunk';
import uniqBy from 'lodash/uniqBy';
import uniqWith from 'lodash/uniqWith';
import { pickArrayOfObject } from '../utils';
import PostgresDB from '../database/postgresDB';
import { DatabaseConfig } from '../configs/database-configs';

export type InsertAction<T, K> = {
  table: string;
  transform?: (data: T[]) => K[];
  keys: Keys<K>;
  uniqueKey?: keyof K | Keys<K>;
  onDone?: (data: K[]) => any;
  upsertOptions?: UpsertOptions;
};

export type UpsertOptions = {
  onConflict?: string;
  returning?: 'minimal' | 'representation';
  count?: 'exact' | 'planned' | 'estimated';
  ignoreDuplicates?: boolean;
};

// Type helper
export const createAction = <T, K = T>(properties: InsertAction<T, K>) =>
  properties;

export const insertData = async <T>(
  data: T[],
  actions: InsertAction<T, any>[],
  transformUniqueKey?: keyof T,
) => {
  const defaultTransform = (data: T[]) => data as any[];

  const client = new PostgresDB(DatabaseConfig);

  await client.connect();

  try {
    for (const action of actions) {
      const {
        table,
        transform = defaultTransform,
        keys,
        uniqueKey,
        onDone,
        upsertOptions = {},
      } = action;

      // Check if the table exists, create it if not
      await createTableIfNotExists(client, table, keys);

      const transformedData = transform(uniqBy(data, transformUniqueKey));
      let pickedData = pickArrayOfObject(transformedData, keys);

      if (Array.isArray(uniqueKey)) {
        pickedData = uniqWith(pickedData, (a, b) =>
          uniqueKey.every(
            (key) => (a as any)[key as string] === (b as any)[key as string],
          ),
        );
      } else if (uniqueKey) {
        pickedData = uniqBy(pickedData, uniqueKey as string | number);
      }

      if (!pickedData.length) continue;

      const chunkedData = chunk(pickedData, 3000);
      let chunkNumber = 1;
      const totalReturnedData = [];

      for (const chunk of chunkedData) {
        console.log(`INSERT ${table}: ${chunkNumber} (${chunk.length})`);

        const columns = keys.join(', ');
        console.log('columns: ', columns);
        const values = chunk
          .map(
            (_, rowIndex) =>
              `(${keys
                .map(
                  (_, keyIndex) => `$${rowIndex * keys.length + keyIndex + 1}`,
                )
                .join(', ')})`,
          )
          .join(', ');
        const conflictTarget = Array.isArray(upsertOptions.onConflict)
          ? upsertOptions.onConflict.join(', ')
          : upsertOptions.onConflict;
        console.log('conflictTarget: ', conflictTarget);
        const updateSet = keys
          .map((key) => `${String(key)} = EXCLUDED.${String(key)}`)
          .join(', ');

        const query = conflictTarget
          ? `
          INSERT INTO ${table} (${columns})
          VALUES ${values}
          ON CONFLICT (${conflictTarget}) DO UPDATE SET ${updateSet}
        `
          : `
          INSERT INTO ${table} (${columns})
          VALUES ${values}
        `;
        const flatValues = chunk.flatMap((row) =>
          keys.map((key) => (row as any)[key]),
        );
        try {
          const result = await client.query(query, flatValues);
          totalReturnedData.push(result.rows);
        } catch (error) {
          console.log(error);
          throw error;
        }

        chunkNumber++;
      }

      onDone?.(totalReturnedData.flat());
      console.log('INSERTED TABLE ' + table);
    }
  } finally {
    await client.disconnect();
  }

  return true;
};

const createTableIfNotExists = async (
  client: PostgresDB,
  tableName: string,
  keys: any[],
) => {
  const result = await client.query(
    `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = $1
    )`,
    [tableName],
  );
  const tableExists = result.rows[0].exists;
  if (!tableExists) {
    const columnsDefinition = keys.map((key) => `${key} TEXT`).join(', ');
    await client.query(`CREATE TABLE ${tableName} (${columnsDefinition})`);
    console.log(`Created table '${tableName}'`);
  }
};
