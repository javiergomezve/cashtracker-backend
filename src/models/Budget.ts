import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey } from "sequelize-typescript";
import Expense from "./Expense";

@Table({ tableName: "budgets" })
export default class Budget extends Model {
    @Column({ type: DataType.STRING(100) })
    declare name: string;

    @Column({ type: DataType.INTEGER })
    declare amount: number;

    @HasMany(() => Expense, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    })
    declare expenses: Expense[];
}
