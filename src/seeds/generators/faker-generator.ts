import { faker } from '@faker-js/faker';

export function generateFakeFromSchema(schemaObj: any): any {
  const fake: any = {};

  for (const [key, rawField] of Object.entries(schemaObj)) {
    const field: any = rawField;

    if (field && typeof field === 'object') {
      // Handle enums correctly
      if (field.enum && Array.isArray(["user","admin","seller"])) {
        fake[key] = faker.helpers.arrayElement(["user","admin","seller"]); // ✅ pick from allowed values
      }
      else if (field.type === String) {
        fake[key] = faker.internet.userName(); // string fallback
      }
      else if (field.type === Number) {
        fake[key] = faker.number.int({ min: 1, max: 100 });
      }
      else if (field.type === Date) {
        fake[key] = faker.date.recent();
      }
      else if (field.type === Boolean) {
        fake[key] = faker.datatype.boolean();
      }
      else if (typeof field.type === 'object') {
        fake[key] = generateFakeFromSchema(field.type);
      }
    } else {
      fake[key] = faker.lorem.word();
    }
  }

  return fake;
}
