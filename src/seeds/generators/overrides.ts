import { faker } from '@faker-js/faker';

const overrides: Record<string, () => any> = {
  email: () => faker.internet.email({
  }),
  username: () => faker.internet.userName(),
  password: () => faker.internet.password({ length: 12 }),
  name: () => faker.commerce.department(),
};

export default overrides;
