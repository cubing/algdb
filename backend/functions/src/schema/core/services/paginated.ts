import { NormalService, PaginatorService } from ".";
export class PaginatedService extends NormalService {
  paginator: PaginatorService;

  constructor(typename?: string) {
    super(typename);
    this.paginator = new PaginatorService(this);
  }

  getPaginator(): PaginatorService {
    return this.paginator;
  }
}
