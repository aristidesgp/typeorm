import { CheckMetadata } from "../../../metadata/CheckMetadata"
import { ColumnMetadata } from "../../../metadata/ColumnMetadata"
import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { ExclusionMetadata } from "../../../metadata/ExclusionMetadata"
import { ForeignKeyMetadata } from "../../../metadata/ForeignKeyMetadata"
import { IndexMetadata } from "../../../metadata/IndexMetadata"
import { UniqueMetadata } from "../../../metadata/UniqueMetadata"
import { Table } from "./model/Table"
import { TableCheck } from "./model/TableCheck"
import { TableColumn } from "./model/TableColumn"
import { TableExclusion } from "./model/TableExclusion"
import { TableForeignKey } from "./model/TableForeignKey"
import { TableIndex } from "./model/TableIndex"
import { TableUnique } from "./model/TableUnique"
import { View } from "./model/View"

export class TableSchemaBuilder {
  /**
   * Creates table from a given entity metadata.
   */
  static createTable(entityMetadata: EntityMetadata): Table {
    return {
      name: entityMetadata.tablePath,
      engine: entityMetadata.engine,
      columns: entityMetadata.columns
        .filter((column) => column)
        .map((column) => this.createColumn(column)),
      foreignKeys: [],
      indices: entityMetadata.indices
        .filter((index) => index.synchronize === true)
        .map((index) => this.createIndex(index)),
      uniques: entityMetadata.uniques.map((unique) =>
        this.createUnique(unique),
      ),
      checks: entityMetadata.checks.map((check) => this.createCheck(check)),
      exclusions: entityMetadata.exclusions.map((exclusion) =>
        this.createExclusion(exclusion),
      ),
      justCreated: false,
    }
  }

  static createColumn(columnMetadata: ColumnMetadata): TableColumn {
    return {
      name: columnMetadata.databaseName,
      length: columnMetadata.length,
      width: columnMetadata.width,
      charset: columnMetadata.charset,
      collation: columnMetadata.collation,
      precision: columnMetadata.precision,
      scale: columnMetadata.scale,
      zerofill: columnMetadata.zerofill,
      unsigned: columnMetadata.unsigned,
      asExpression: columnMetadata.asExpression,
      generatedType: columnMetadata.generatedType,
      default: columnMetadata.normalizedDefault,
      onUpdate: columnMetadata.onUpdate,
      comment: columnMetadata.comment,
      isGenerated: columnMetadata.isGenerated,
      generationStrategy: columnMetadata.generationStrategy,
      isNullable: columnMetadata.isNullable,
      type: columnMetadata.normalizedType,
      isPrimary: columnMetadata.isPrimary,
      isUnique: columnMetadata.normalizedIsUnique,
      isArray: columnMetadata.isArray || false,
      enum: columnMetadata.enum
        ? columnMetadata.enum.map((val) => val + "")
        : columnMetadata.enum,
      enumName: columnMetadata.enumName,
      spatialFeatureType: columnMetadata.spatialFeatureType,
      srid: columnMetadata.srid,
    }
  }

  /**
   * Creates unique from the unique metadata object.
   */
  static createUnique(uniqueMetadata: UniqueMetadata): TableUnique {
    return {
      name: uniqueMetadata.name,
      columnNames: uniqueMetadata.columns.map((column) => column.databaseName),
    }
  }
  /**
   * Creates index from the index metadata object.
   */
  static createIndex(indexMetadata: IndexMetadata): TableIndex {
    return {
      name: indexMetadata.name,
      columnNames: indexMetadata.columns.map((column) => column.databaseName),
      isUnique: indexMetadata.isUnique,
      isSpatial: indexMetadata.isSpatial,
      isFulltext: indexMetadata.isFulltext,
      parser: indexMetadata.parser,
      where: indexMetadata.where,
    }
  }

  /**
   * Creates a new table foreign key from the given foreign key metadata.
   */
  static createForeignKey(metadata: ForeignKeyMetadata): TableForeignKey {
    return {
      name: metadata.name,
      columnNames: metadata.columnNames,
      referencedColumnNames: metadata.referencedColumnNames,
      referencedTableName: metadata.referencedTablePath,
      onDelete: metadata.onDelete,
      onUpdate: metadata.onUpdate,
      deferrable: metadata.deferrable,
    }
  }

  /**
   * Creates exclusions from the exclusion metadata object.
   */
  static createExclusion(exclusionMetadata: ExclusionMetadata): TableExclusion {
    return {
      name: exclusionMetadata.name,
      expression: exclusionMetadata.expression,
    }
  }

  /**
   * Creates checks from the check metadata object.
   */
  static createCheck(checkMetadata: CheckMetadata): TableCheck {
    return {
      name: checkMetadata.name,
      expression: checkMetadata.expression,
    }
  }

  /**
   * Creates view from a given entity metadata.
   */
  static createView(entityMetadata: EntityMetadata): View {
    if (entityMetadata.expression instanceof Function) {
      throw new Error(
        `Expression isn't supported. Please supply a string value.`,
      )
    }
    return {
      name: entityMetadata.tablePath,
      expression: entityMetadata.expression || "",
      materialized: entityMetadata.tableMetadataArgs.materialized || false,
    }
  }
}
