import generateEnumService from './core/generator/enum.service'
import { userRole, caseVisualization } from './enums';

const userRoleEnum = generateEnumService('userRole', userRole);
const caseVisualizationEnum = generateEnumService('caseVisualization', caseVisualization);

export { User } from './user/user.service'
export { Auth } from './auth/auth.service'
export { Puzzle } from './puzzle/puzzle.service'
export { Algset } from './algset/algset.service'
export { Subset } from './subset/subset.service'
export { Algcase } from './algcase/algcase.service'
export { Alg } from './alg/alg.service'
export { AlgAlgcaseLink } from './link/algAlgcaseLink/algAlgcaseLink.service'
export { UserAlgTagLink } from './link/userAlgTagLink/userAlgTagLink.service'
export { Tag } from './tag/tag.service'


export { userRoleEnum as UserRoleEnum }
export { caseVisualizationEnum as CaseVisualizationEnum }