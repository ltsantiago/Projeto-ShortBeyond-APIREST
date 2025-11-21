import { test as baseTest,expect } from '@playwright/test';
import { authService } from '../../support/services/auth.js';
import { linksService } from '../../support/services/links.js';

const test = baseTest.extend({
  auth: async ({ request }, use) => {
    const auth = authService(request);
    await use(auth);
  },

  links: async ({ request }, use) => {
    const link = linksService(request);
    await use(link);
  }
});

export { test, expect };
