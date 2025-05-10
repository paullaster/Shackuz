# @brainspore/shackuz

## Overview

`@brainspore/shackuz` is a modern TypeScript package for building robust, scalable, and maintainable email templates in JavaScript/TypeScript projects. It provides a flexible API for generating HTML email content with customizable blocks and themes.

## Installation

```bash
npm install @brainspore/shackuz
# or
yarn add @brainspore/shackuz
```

## Usage Example

```typescript
import { EmailTemplateBuilder } from "@brainspore/shackuz";

// Create a new email template builder instance
const email = new EmailTemplateBuilder({
  appConfig: { title: "Welcome Email" }
})
  .addBlock("h", "Welcome to Shackuz!")
  .addBlock("p", "Hello {{name}},\n\nThank you for joining us.")
  .addBlock("d")
  .addBlock("p", "Regards")
  .addBlock("p", "Shackuz")
  .buildHTML();

console.log(email);
```

## Test Script Example & How to Run

A top-tier test suite is provided to ensure reliability. The main test file is located at:

- `test/email-template-builder.test.ts`

Example test (from the test suite):

```typescript
import { EmailTemplateBuilder } from "../server";

describe("EmailTemplateBuilder", () => {
  it("builds a simple email HTML with header and paragraph", () => {
    const builder = new EmailTemplateBuilder({
      appConfig: { title: "Test Email" }
    })
      .addBlock("h", "Welcome!")
      .addBlock("p", "Hello user!");
    const html = builder.buildHTML();
    expect(html).toContain("<h1");
    expect(html).toContain("Welcome!");
    expect(html).toContain("<p");
    expect(html).toContain("Hello user!");
    expect(html).toContain("Test Email");
  });
});
```

### Running Tests

To run all tests, use:

```bash
npm test
```

Or to run only the top-level tests in the `test/` directory:

```bash
npm run test:top
```

## Deployment

This package includes a deployment script (`deploy.sh`) for automated releases. See the Deployment section in this README for details.

---

## License

MIT
