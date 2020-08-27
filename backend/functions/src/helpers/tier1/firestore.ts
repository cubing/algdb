import firestore from '../../utils/firestore';

export default {
  db: firestore.db,
  fieldValue: firestore.admin.firestore.FieldValue
};