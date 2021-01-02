import { NormalService, PaginatorService } from ".";
export class PaginatedService extends NormalService {
  paginator: PaginatorService;

  constructor() {
    super();
    this.paginator = new PaginatorService(this);
  }
}
