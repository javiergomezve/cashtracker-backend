import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import Budget from "./Budget";

@Table({ tableName: "expenses" })
export default class Expense extends Model {
    @Column({ type: DataType.STRING(100) })
    declare name: string;

    @Column({ type: DataType.INTEGER })
    declare amount: number;

    @ForeignKey(() => Budget)
    declare budgetId: number;

    @BelongsTo(() => Budget)
    declare budget: Budget;
}
