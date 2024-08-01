// edit-user-data.service.ts

import { user } from "@/services/gun";

interface Item {
  id: number;
  url: string;
}

export const updateData = (type: string, items: Item[]) => {
  user.get("favourites").put({ [type]: JSON.stringify(items) });
};
