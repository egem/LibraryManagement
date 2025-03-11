import { DataTypes, Model } from 'sequelize';

import sequelize from 'Config/Sequelize';
import { TableName } from 'Services/DatabaseService/Enums/TableName.enum';
import { ModelName } from 'Services/DatabaseService/Enums/ModelName.enum';

export class User extends Model {
  public id!: number;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

User.init(
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
    modelName: ModelName.User,
    tableName: TableName.Users,
    timestamps: false
  }
);
