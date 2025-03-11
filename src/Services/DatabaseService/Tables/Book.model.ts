// models/Book.ts
import { DataTypes, Model } from 'sequelize';

import sequelize from 'Config/Sequelize';
import { TableName } from 'Services/DatabaseService/Enums/TableName.enum';

export class Book extends Model {
  public id!: number;
  public name!: string;
  public averageRating!: number;
  public totalRating!: number;
  public ratingCount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    totalRating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: TableName.Books,
    timestamps: false
  }
);
