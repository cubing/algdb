import { userRole, caseVisualization } from './enums';
import * as generators from './core/generators';
const userRoleEnum = generators.generateEnumService('userRole', userRole);
const caseVisualizationEnum = generators.generateEnumService('caseVisualization', caseVisualization);

export { User } from './user/service'
export { Auth } from './auth/service'
export { Puzzle } from './puzzle/service'
export { Algset } from './algset/service'
export { Subset } from './subset/service'
export { Algcase } from './algcase/service'
export { Alg } from './alg/service'
export { AlgAlgcaseLink } from './link/algAlgcaseLink/service'
export { AlgTagLink } from './link/algTagLink/service'
export { UserAlgTagLink } from './link/userAlgTagLink/service'
export { UserAlgVoteLink } from './link/userAlgVoteLink/service'
export { Tag } from './tag/service'

export { userRoleEnum as UserRoleEnum }
export { caseVisualizationEnum as CaseVisualizationEnum }