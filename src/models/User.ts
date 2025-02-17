import { AllowNull, Column, DataType, Default, HasMany, Model, Table, Unique } from "sequelize-typescript";
import Budget from "./Budget";

@Table({ tableName: "users" })
export default class User extends Model {
    @AllowNull(false)
    @Column({ type: DataType.STRING(50) })
    declare firstName: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING(50) })
    declare lastName: string;

    @AllowNull(false)
    @Column({ type: DataType.STRING(60) })
    declare password: string;

    @AllowNull(false)
    @Unique(true)
    @Column({ type: DataType.STRING(100) })
    declare email: string;

    @Column({ type: DataType.STRING(6) })
    declare token: string;

    @Default(false)
    @Column({ type: DataType.BOOLEAN })
    declare confirmed: boolean;

    @HasMany(() => Budget, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    declare budgets: Budget[];
}
