import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, AllowNull } from "sequelize-typescript";
import Expense from "./Expense";
import User from "./User";

@Table({ tableName: "budgets" })
export default class Budget extends Model {
    @AllowNull(false)
    @Column({ type: DataType.STRING(100) })
    declare name: string;

    @AllowNull(false)
    @Column({ type: DataType.INTEGER })
    declare amount: number;

    @HasMany(() => Expense, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    declare expenses: Expense[];

    @ForeignKey(() => User)
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;
}
