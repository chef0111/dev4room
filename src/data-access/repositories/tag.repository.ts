import "server-only"; 
import { db } from "@/database/drizzle"; 
import { tag } from "@/database/schema"; 
import { desc, ilike, or, sql } from "drizzle-orm"
import { toTagDTO } from "../mappers/tag.mapper";
import { TagDTO } from "../dto/tag.dto";

interface GetTagsParams {
    page?: number; 
    pageSize?: number; 
    searchQuery?: string; 
}

export async function getTags(tagRequest: GetTagsParams): Promise<{
    tags: TagDTO[];
    total: number; 
}> {
    const { page = 1, pageSize = 10, searchQuery} = tagRequest; 
    const offset = (page - 1) * pageSize;
    
    // 1. build query conditions 
    const whereConditions = []; 
    if (searchQuery) {
        whereConditions.push(ilike(tag.name, `%${searchQuery}%`)); 
    }

    // 2. execute database query 
    const results = await db
        .select({
            id: tag.id,
            name: tag.name, 
            noOfQuestions: tag.questions,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt, 
            // totalCount: sql<number>`count(*) over()`.as("total_count"),  
        })
        .from(tag)
        .where(whereConditions.length > 0 ? or(...whereConditions) : undefined)
        .orderBy(desc(tag.questions)) 
        .limit(pageSize)
        .offset(offset);
    
    // 3. after having retrieved from the db 
    // (the results array may contains more than 1 row) 
    // we need to format those rows under the form of TagDTO
    // the values for total = results.totalCount

    // 4. extract total 
    // const total = results[0]?.totalCount ?? 0;

    // 5. use mapper to transform each result 
    const mappedTags = results
        // apply a DTO transformation to each item in the results array
        .map((rawTag) => toTagDTO(rawTag))
        // remove any invalid tags from the list, only valid TagDTO objects remain
        .filter((tag): tag is TagDTO => tag !== null); 

    // 6. return clean DTOs
    return {
        tags: mappedTags,
        total: mappedTags.length
    }; 
}