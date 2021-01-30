import { LinkService } from "../core/services";

type LinkDefinition = {
  types: Map<string, LinkService>;
};

export const linkDefs: Map<string, LinkDefinition> = new Map();
