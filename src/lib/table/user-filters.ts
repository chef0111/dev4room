import type { ExtendedColumnFilter } from "@/common/types/data-table";

export interface UserListApiParams {
  search?: string;
  role?: string;
  banned?: boolean;
  emailVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  limit: number;
  offset: number;
}

interface BasicFilterValues {
  name: string;
  email: string;
  role: string[];
  status: string[];
  createdAt: string;
}

// Parse a timestamp value to Date
function parseTimestamp(val: unknown): Date | undefined {
  if (!val) return undefined;
  const num = typeof val === "string" ? Number(val) : val;
  if (typeof num === "number" && !isNaN(num)) {
    return new Date(num);
  }
  return undefined;
}

// Get start of day for a date
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Get start of next day for a date
function startOfNextDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

// Parse date filter from advanced filter based on operator
function parseDateFilter<TData>(filter: ExtendedColumnFilter<TData>): {
  createdAfter?: Date;
  createdBefore?: Date;
} {
  const values = Array.isArray(filter.value) ? filter.value : [filter.value];
  const date1 = parseTimestamp(values[0]);
  const date2 = parseTimestamp(values[1]);

  let createdAfter: Date | undefined;
  let createdBefore: Date | undefined;

  switch (filter.operator) {
    case "eq": // Exact date match
      if (date1) {
        createdAfter = startOfDay(date1);
        createdBefore = startOfNextDay(date1);
      }
      break;
    case "lt": // Before date
      if (date1) {
        createdBefore = startOfDay(date1);
      }
      break;
    case "gt": // After date
      if (date1) {
        createdAfter = startOfNextDay(date1);
      }
      break;
    case "lte": // On or before date
      if (date1) {
        createdBefore = startOfNextDay(date1);
      }
      break;
    case "gte": // On or after date
      if (date1) {
        createdAfter = startOfDay(date1);
      }
      break;
    case "isBetween": // Between two dates
      if (date1) {
        createdAfter = startOfDay(date1);
      }
      if (date2) {
        createdBefore = startOfNextDay(date2);
      }
      break;
    default:
      // Default to "on or after"
      if (date1) {
        createdAfter = startOfDay(date1);
      }
  }

  return { createdAfter, createdBefore };
}

// Convert advanced filters to API parameters
export function parseAdvancedFilters<TData>(
  filters: ExtendedColumnFilter<TData>[]
): Omit<UserListApiParams, "limit" | "offset"> {
  let search: string | undefined;
  let role: string | undefined;
  let banned: boolean | undefined;
  let emailVerified: boolean | undefined;
  let createdAfter: Date | undefined;
  let createdBefore: Date | undefined;

  for (const filter of filters) {
    if (filter.id === "name" || filter.id === "email") {
      if (typeof filter.value === "string" && filter.value) {
        search = filter.value;
      }
    } else if (filter.id === "role") {
      if (Array.isArray(filter.value) && filter.value.length > 0) {
        role = filter.value[0] as string;
      } else if (typeof filter.value === "string" && filter.value) {
        role = filter.value;
      }
    } else if (filter.id === "status") {
      const status = Array.isArray(filter.value)
        ? filter.value[0]
        : filter.value;
      if (status === "banned") {
        banned = true;
      } else if (status === "active") {
        banned = false;
        emailVerified = true;
      } else if (status === "unverified") {
        banned = false;
        emailVerified = false;
      }
    } else if (filter.id === "createdAt") {
      const dateResult = parseDateFilter(filter);
      createdAfter = dateResult.createdAfter;
      createdBefore = dateResult.createdBefore;
    }
  }

  return { search, role, banned, emailVerified, createdAfter, createdBefore };
}

// Convert basic filters to API parameters
export function parseBasicFilters(
  values: BasicFilterValues
): Omit<UserListApiParams, "limit" | "offset"> {
  const search = values.name || values.email || undefined;
  const role = values.role.length > 0 ? values.role[0] : undefined;

  let banned: boolean | undefined;
  let emailVerified: boolean | undefined;
  if (values.status.length > 0) {
    const status = values.status[0];
    if (status === "banned") {
      banned = true;
    } else if (status === "active") {
      banned = false;
      emailVerified = true;
    } else if (status === "unverified") {
      banned = false;
      emailVerified = false;
    }
  }

  let createdAfter: Date | undefined;
  let createdBefore: Date | undefined;
  if (values.createdAt) {
    const ts = Number(values.createdAt);
    if (!isNaN(ts)) {
      const date = new Date(ts);
      createdAfter = startOfDay(date);
      createdBefore = startOfNextDay(date);
    }
  }

  return { search, role, banned, emailVerified, createdAfter, createdBefore };
}
