import { FilterQuery, Model } from "mongoose";
export interface IPaginate {
    page: number,
}

export type finderOneArg<TDocument> = {
    filter?: FilterQuery<TDocument>,
    populate?: any,
    select?: string,
    projection?: any
}
export type findersArgs<TDocument> =
    finderOneArg<TDocument> & {
        paginate?: IPaginate,
        sort?: any
    }
export type UpdateArgs<TDocument> = {
    filter?: FilterQuery<TDocument>,
    update?: any,
    populate?: any,
    select?: string
}




export abstract class AbstractRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) { }
    async findAll({ filter = {}, populate, select, paginate, sort, projection }: findersArgs<TDocument>): Promise<TDocument[] | any> {
        let query = this.model.find(filter)
        if (select) query = query.select(select)
        if (populate) query = query.populate(populate)
        if (sort) query = query.sort(sort)
        if (projection) query = query.select(projection)
        const data = await query.exec();
        return { data };
    }
    async findOne({ filter = {}, populate, select, projection }: finderOneArg<TDocument>): Promise<TDocument | null> {
        let query = this.model.findOne(filter)
        if (select) query = query.select(select)
        if (populate) query = query.populate(populate)
        if (projection) query = query.select(projection)

        return query.exec();
    }

    async create(document: Partial<TDocument>): Promise<TDocument> {
        const doc = await this.model.create(document);
        return doc;
    }

    async update({
        filter,
        update,
        populate,
        select
    }: UpdateArgs<TDocument>): Promise<TDocument | null> {
        let query = this.model.findOneAndUpdate(filter, update, { new: true, runValidators: true })
        if (select) query = query.select(select)
        if (populate) query = query.populate(populate)
        return query.exec();
    }

    async delete(
        filter: FilterQuery<TDocument>,
    ): Promise<TDocument | null> {
        let query = this.model.findOneAndDelete(filter)
        return query.exec();
    }

}