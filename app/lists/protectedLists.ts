import seedLists from "@data/seedLists.json"

// The bundled default lists are read-only on the shared server: visitors can view
// or duplicate them, but not overwrite or delete the originals.
export const PROTECTED_LIST_IDS: string[] = (seedLists as { id: string }[]).map((l) => l.id)

export const isProtectedList = (id: string | undefined | null): boolean => !!id && PROTECTED_LIST_IDS.includes(id)
