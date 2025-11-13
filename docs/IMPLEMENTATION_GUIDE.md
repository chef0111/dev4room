# Implementation Guide: Server Actions & API Routes

A concise guide for implementing server actions, API routes, DAL, and DTO layers.

---

## Architecture Overview

```
Client Request → API Route/Server Action → DAL → Database
                       ↓                     ↓
                  Validate Input      Validate Output (DTO)
```

---

## 1. DTO Layer (Data Transfer Object)

**Purpose**: Define and validate data structure from database

**File**: `src/server/{entity}/{entity}.dto.ts`

```typescript
import "server-only";
import z from "zod";

// Define schema with validation rules
export const UsersSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long." }),
  email: z.email({ message: "Invalid email address." }),
  image: z.url({ message: "Invalid image URL." }).nullable(),
  role: z.string().nullable(),
});

// Export type from schema
export type UsersDTO = z.infer<typeof UsersSchema>;
```

**Key Points**:

- Use `"server-only"` import to prevent client-side bundling
- Define Zod schema for runtime validation
- Export both schema and type
- Add meaningful error messages

---

## 2. DAL Layer (Data Access Layer)

**Purpose**: Handle all database queries and output validation

**File**: `src/server/{entity}/{entity}.dal.ts`

```typescript
import "server-only";
import { db } from "@/database/drizzle";
import { user } from "@/database/schema";
import { UsersDTO, UsersSchema } from "./user.dto";
import { and, or, ilike, desc, asc, sql, SQL } from "drizzle-orm";

export async function getUsers(
  params: QueryParams,
): Promise<{ users: UsersDTO[]; totalUsers: number }> {
  const { page = 1, pageSize = 10, query, filter } = params;

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Build dynamic WHERE conditions
  const conditions: (SQL<unknown> | undefined)[] = [];

  if (query) {
    conditions.push(
      or(ilike(user.name, `%${query}%`), ilike(user.username, `%${query}%`)),
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Dynamic ORDER BY
  let sortCriteria;
  switch (filter) {
    case "newest":
      sortCriteria = desc(user.createdAt);
      break;
    case "oldest":
      sortCriteria = asc(user.createdAt);
      break;
    case "popular":
      sortCriteria = desc(user.reputation);
      break;
    default:
      sortCriteria = asc(user.createdAt);
  }

  // Single query with window function for total count
  const results = await db
    .select({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      image: user.image,
      role: user.role,
      totalCount: sql<number>`count(*) over()`.as("total_count"),
    })
    .from(user)
    .where(where)
    .orderBy(sortCriteria)
    .limit(limit)
    .offset(offset);

  const totalUsers = results[0]?.totalCount ?? 0;
  const users = results.map(({ totalCount, ...userData }) => userData);

  // Validate output with DTO schema
  const validatedUsers = users
    .map((user) => {
      const result = UsersSchema.safeParse(user);
      if (!result.success) {
        console.error("User validation failed:", result.error);
        return null;
      }
      return result.data;
    })
    .filter((user): user is UsersDTO => user !== null);

  return { users: validatedUsers, totalUsers };
}
```

**Key Points**:

- Use `"server-only"` to prevent client bundling
- Build dynamic WHERE conditions with `and()` and `or()`
- Use `ilike()` for case-insensitive search
- Window function `count(*) over()` gets total in one query
- Always validate output with DTO schema
- Return typed DTOs

**Hints**:

- For filters: Build conditions array, combine with `and()`
- For search: Use `ilike(column, '%term%')` for partial match
- For sorting: Use `desc()` or `asc()` from Drizzle
- For pagination: Use `.limit()` and `.offset()`
- For total count: Add `sql<number>\`count(\*) over()\`` to SELECT

---

## 3. Server Action

**Purpose**: Handle server-side logic, validate input, orchestrate DAL calls

**File**: `src/server/{entity}/{entity}.action.ts`

**Structure**:

```typescript
"use server";

import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
// Import your DAL function
// Import your DTO types
// Import validation schema

interface ResponseData {
  // Define your response data structure
}

export async function fetchEntity(
  params: QueryParams,
): Promise<ActionResponse<ResponseData>> {
  // 1. Validate input with action helper
  // 2. Check if validation failed
  // 3. Extract validated params
  // 4. Call DAL in try-catch
  // 5. Return success response or error
}
```

**Implementation Steps**:

1. **Add `"use server"` directive** at the top
2. **Import dependencies**:
   - `action` helper from `@/lib/handlers/action`
   - `handleError` from `@/lib/handlers/error`
   - Your DAL function
   - Your DTO types
   - Validation schema from `@/lib/validations`

3. **Define response interface** matching your DAL return type

4. **Validate input**:

   ```typescript
   const validationResult = await action({
     params,
     schema: YourSchema,
     authorize: false, // true if auth required
   });
   ```

5. **Handle validation errors**:

   ```typescript
   if (validationResult instanceof Error) {
     return handleError(validationResult) as ErrorResponse;
   }
   ```

6. **Extract validated params**:

   ```typescript
   const validatedParams = validationResult.params!;
   ```

7. **Call DAL in try-catch**:
   ```typescript
   try {
     const data = await yourDalFunction(validatedParams);
     return { success: true, data };
   } catch (error) {
     return handleError(error) as ErrorResponse;
   }
   ```

**Key Points**:

- Input validation happens HERE (not in DAL)
- Set `authorize: true` for protected routes
- Use existing schemas from `@/lib/validations`
- Keep business logic minimal - delegate to DAL
- Always handle errors gracefully
- Return consistent `ActionResponse` format

---

## 4. API Route

**Purpose**: HTTP endpoint that calls DAL, handles REST requests

**File**: `src/app/api/{entity}/route.ts`

**Structure**:

```typescript
import { NextRequest, NextResponse } from "next/server";
// Import DAL function
// Import handleError
// Import validation schema

export async function GET(request: NextRequest) {
  try {
    // 1. Extract query params from URL
    // 2. Validate params with schema
    // 3. Call DAL with validated params
    // 4. Return JSON response with data
  } catch (error) {
    // Handle error with handleError(error, "api")
  }
}
```

**Implementation Steps**:

1. **Import dependencies**:

   ```typescript
   import { NextRequest, NextResponse } from "next/server";
   import { yourDalFunction } from "@/server/{entity}/{entity}.dal";
   import handleError from "@/lib/handlers/error";
   import { YourSchema } from "@/lib/validations";
   ```

2. **Extract query parameters**:

   ```typescript
   const searchParams = request.nextUrl.searchParams;
   const params = {
     param1: searchParams.get("param1") || "default",
     param2: searchParams.get("param2") || undefined,
     // ... other params
   };
   ```

3. **Validate with Zod schema**:

   ```typescript
   const validationResult = YourSchema.safeParse(params);

   if (!validationResult.success) {
     return NextResponse.json(
       { success: false, error: { message: "Invalid parameters" } },
       { status: 400 },
     );
   }
   ```

4. **Extract validated data**:

   ```typescript
   const { param1, param2 } = validationResult.data;
   ```

5. **Call DAL** (convert types if needed):

   ```typescript
   const data = await yourDalFunction({
     param1: Number(param1), // if needs conversion
     param2,
   });
   ```

6. **Return formatted response**:

   ```typescript
   return NextResponse.json(
     {
       success: true,
       data: {
         ...data,
         // Add pagination metadata if applicable
       },
     },
     { status: 200 },
   );
   ```

7. **Handle errors**:
   ```typescript
   catch (error) {
     return handleError(error, "api") as ApiErrorResponse;
   }
   ```

**Key Points**:

- Extract params from `request.nextUrl.searchParams`
- Use `.safeParse()` not `.parse()` to avoid throws
- Convert string params to numbers if schema expects numbers
- Return proper HTTP status codes (200, 400, 500)
- Use consistent response format
- Always wrap in try-catch

**HTTP Methods**:

- **GET**: Query params from URL
- **POST**: Body from `await request.json()`
- **PUT/PATCH**: Validate both params and body
- **DELETE**: Return 204 No Content on success

---

## 5. Validation Schema

**Purpose**: Define input validation rules

**File**: `src/lib/validations.ts`

```typescript
import z from "zod";

export const QueryParamsSchema = z.object({
  page: z.number().int().min(1).default(1).optional(),
  pageSize: z.number().int().min(1).max(100).default(10).optional(),
  query: z.string().optional(),
  filter: z.string().optional(),
});
```

**Key Points**:

- Use appropriate Zod types
- Add `.optional()` for optional fields
- Add `.default()` for default values
- Add constraints (`.min()`, `.max()`, etc.)

---

## Quick Implementation Checklist

### For a New Entity (e.g., `Question`):

**1. Create DTO** (`src/server/question/question.dto.ts`):

- Add `"server-only"` import
- Define Zod schema with all fields
- Export both schema and type
- Add validation rules and error messages

**2. Create DAL** (`src/server/question/question.dal.ts`):

- Add `"server-only"` import
- Import db, schema table, DTO
- Build dynamic query with filters
- Use window function for total count
- Validate output with DTO schema
- Return typed data

**3. Create Server Action** (`src/server/question/question.action.ts`):

- Add `"use server"` directive
- Import action helper, handleError, DAL, DTO
- Validate input with action helper
- Call DAL in try-catch
- Return ActionResponse format

**4. Create API Route** (`src/app/api/question/route.ts`) _(optional)_:

- Import NextRequest, NextResponse
- Extract and validate params
- Call DAL function
- Return JSON response
- Handle errors with handleError(error, "api")

---

## Common Patterns

### Dynamic Filtering

```typescript
const conditions: SQL<unknown>[] = [];

if (status) conditions.push(eq(table.status, status));
if (authorId) conditions.push(eq(table.authorId, authorId));

const where = conditions.length > 0 ? and(...conditions) : undefined;
```

### Search Multiple Fields

```typescript
if (query) {
  conditions.push(
    or(ilike(table.title, `%${query}%`), ilike(table.content, `%${query}%`)),
  );
}
```

### Join Tables

```typescript
const results = await db
  .select({
    id: question.id,
    title: question.title,
    authorName: user.name,
  })
  .from(question)
  .leftJoin(user, eq(question.authorId, user.id));
```

### Count with Relations

```typescript
const results = await db
  .select({
    id: question.id,
    answerCount: sql<number>`count(${answer.id})`,
  })
  .from(question)
  .leftJoin(answer, eq(question.id, answer.questionId))
  .groupBy(question.id);
```

---

## Best Practices

1. **Validation**:
   - Input validation: Server Action / API Route
   - Output validation: DAL layer with DTO

2. **Error Handling**:
   - Use `handleError()` consistently
   - Log errors in DAL for debugging
   - Return user-friendly messages

3. **Type Safety**:
   - Always export and use DTO types
   - Use TypeScript strict mode
   - Leverage Zod for runtime safety

4. **Performance**:
   - Use window functions for counts
   - Limit SELECT fields to what's needed
   - Add database indexes for searched fields

5. **Security**:
   - Use `"server-only"` in DAL/DTO
   - Validate all inputs
   - Use `authorize: true` for protected actions
   - Sanitize user input in queries

---

**Happy coding** 🎯
