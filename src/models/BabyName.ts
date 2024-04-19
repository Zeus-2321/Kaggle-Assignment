import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database'; // Import the database connection

class BabyName extends Model {
  public id!: number;
  public name!: string;
  public sex!: string;
}

BabyName.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BabyName',
    tableName: 'baby_names',
    timestamps: false,
  }
);

(async () => {
  try {
    await sequelize.sync();
    console.log('BabyName table synchronized with database.');
  } catch (error) {
    console.error('Error synchronizing BabyName table with database:', error);
  }
})();

export default BabyName;
