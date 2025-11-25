import "server-only";
import { TagSchemaDTO, TagDTO } from "../dto/tag.dto";
import { question } from "@/database/schema";

interface RawTagFromDB {
    id: string; 
    name: string; 
    noOfQuestions: number;
    createdAt: Date; 
    updatedAt: Date;  
}

// function to transform raw DB tag data into DTO shape
export function toTagDTO(rawTag: RawTagFromDB): TagDTO | null {
    try {
        // take out the data from the parameters
        const rawTagData = {
            id: rawTag.id, 
            name: rawTag.name,
            noOfQuestion: rawTag.noOfQuestions, 
            createdAt: rawTag.createdAt,
        }; 

        // validate its mataches the DTO schema
        const validatedDTOTag = TagSchemaDTO.parse(rawTagData); 
        return validatedDTOTag; 
    } catch (error) {
        console.error("Failed to map tag: ", error);  
        return null; 
    }
}