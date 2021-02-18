import { LinkService, NormalService } from "../core/services";

type LinkDefinition = {
  types: Map<string, NormalService>;
  service: LinkService;
};

export const linkDefs: Map<string, LinkDefinition> = new Map();
