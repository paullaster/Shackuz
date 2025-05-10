interface BlockType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface Theme {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
interface Config {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface ApplicationConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export class EmailTemplateBuilder {
  private theme: Theme = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private blocks: Array<any> = []
  private appConfig: ApplicationConfig = {}
  private styles: string = '';
  private customFooter: string = '';

  constructor(config: Config = {}) {
    this.theme = {
      fontFamily: 'Helvetica Neue\', Arial, sans-serif',
      backgroundColor: '#f4f6f8',
      textColor: '#333333',
      primaryColor: '#2563eb',
      buttonGradient: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
      secondaryColor: '#1d4ed8',
      ...config.theme,
    }
    this.blocks = []
    this.appConfig = {
      appName: process.env.APP_NAME || 'SHACKUZ',
      appUrl: process.env.APP_URL || "http://localhost:3500",
      year: new Date().getFullYear(),
      ...config.appConfig,
    }
    // Handle custom styles
    if (typeof config.styles === 'string') {
      this.styles = config.styles;
    } else if (typeof config.styles === 'object' && config.styles !== null) {
      this.styles = EmailTemplateBuilder.objectToCSS(config.styles);
    } else {
      this.styles = EmailTemplateBuilder.defaultStyles(this.theme);
    }
  }

  /**
   * Set custom footer content (HTML string or plain text)
   * @param content string
   */
  setFooter(content: string) {
    this.customFooter = content;
    return this;
  }

  // Helper to convert camelCase to kebab-case
  private static toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // Helper to convert a JS object to CSS string
  private static objectToCSS(stylesObj: Record<string, any>): string {
    let css = '';
    for (const selector in stylesObj) {
      css += `${selector} {`;
      for (const [prop, value] of Object.entries(stylesObj[selector])) {
        css += `${EmailTemplateBuilder.toKebabCase(prop)}: ${value};`;
      }
      css += '}\n';
    }
    return css;
  }

  // Default styles as a function for easy override
  private static defaultStyles(theme: Theme): string {
    return `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: ${theme.fontFamily};
            background-color: ${theme.backgroundColor};
            line-height: 1.6;
            color: ${theme.textColor};
            padding: 20px;
          }
          .container {
            max-width: 1000px;
            width: 100%;
            margin: 0 auto;
          }
          main {
            background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            padding: 40px;
            border: 1px solid #e5e7eb;
            margin-bottom: 20px;
          }
          footer {
            text-align: center;
            font-size: 14px;
            color: #6b7280;
            padding: 20px;
          }
          @media (max-width: 640px) {
            .container { padding: 10px; }
            main, footer { padding: 20px; }
            h1 { font-size: 24px; }
            a { display: block; text-align: center; }
          }
        `;
  }

  static blocks: BlockType = {
    h: (text: string, styles: object = {}) => {
      const defaultStyles = {
        fontSize: '28px',
        fontWeight: 600,
        color: '#1a1a1a',
        marginBottom: '20px',
        letterSpacing: '-0.5px',
      };
      // Merge default and user styles, user styles take precedence
      const mergedStyles = { ...defaultStyles, ...styles };
      const stylesArray: Array<string> = [];
      for (const [key, value] of Object.entries(mergedStyles)) {
        stylesArray.push(`${EmailTemplateBuilder.toKebabCase(key)}: ${value}`);
      }

      return `
      <h1 style="${stylesArray.join('; ')}">
        ${text}
      </h1>
    `
    },
    p: (text: string, styles: object = {}) => {
      const defaultStyles = {
        fontSize: '16px',
        color: '#4b5563',
        marginBottom: '20px',
      };
      // Merge default and user styles, user styles take precedence
      const mergedStyles = { ...defaultStyles, ...styles };
      const stylesArray: Array<string> = [];
      for (const [key, value] of Object.entries(mergedStyles)) {
        stylesArray.push(`${EmailTemplateBuilder.toKebabCase(key)}: ${value}`);
      }
      return `
      <p style="${stylesArray.join('; ')}">
        ${text}
      </p>
    `
    },

    b: (text: string, url: string, styles: object = {}) => {
      const defaultStyles = {
        display: 'inline-block',
        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
        fontSize: '16px',
        fontWeigth: 500,
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      };
      // Merge default and user styles, user styles take precedence
      const mergedStyles = { ...defaultStyles, ...styles };
      const stylesArray: Array<string> = [];
      for (const [key, value] of Object.entries(mergedStyles)) {
        stylesArray.push(`${EmailTemplateBuilder.toKebabCase(key)}: ${value}`);
      }
      return `
      <a href="${url}" style="${stylesArray.join('; ')}"
        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.3)';"
        onmouseout="this.style.transform=''; this.style.boxShadow='';">
        ${text}
      </a>
    `
    },
    d: (styles: object = {}) => {
      const defaultStyles = {
        border: 'none',
        margin: '20px 0'
      };
      // Merge default and user styles, user styles take precedence
      const mergedStyles = { ...defaultStyles, ...styles };
      const stylesArray: Array<string> = [];
      for (const [key, value] of Object.entries(mergedStyles)) {
        stylesArray.push(`${EmailTemplateBuilder.toKebabCase(key)}: ${value}`);
      }
      return `
      <hr style="${stylesArray.join('; ')}" />
    `
    },
    link: (link: string, styles: object = {}) => {
      const defaultStyles = {
        textDecoration: 'underline',
      };
      // Merge default and user styles, user styles take precedence
      const mergedStyles = { ...defaultStyles, ...styles };
      const stylesArray: Array<string> = [];
      for (const [key, value] of Object.entries(mergedStyles)) {
        stylesArray.push(`${EmailTemplateBuilder.toKebabCase(key)}: ${value}`);
      }
      return `
        <a href="${link}" style="${stylesArray.join('; ')}">${link}</a>
      </p>
    `
    },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addBlock(type: string, ...args: any[]) {
    if (!EmailTemplateBuilder.blocks[type]) {
      throw new Error(`Invalid block type: ${type}`)
    }
    this.blocks.push(EmailTemplateBuilder.blocks[type](...this.sanitizeArgs(args)))
    return this
  }

  buildHTML() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.appConfig.title}</title>
        <style>
          ${this.styles}
        </style>
      </head>
      <body>
        <div class="container">
          <main>
            ${this.blocks.join('')}
          </main>
          <footer>
          ${this.customFooter ? `<div class="custom-footer">${this.customFooter}</div>` : ''}
            <p><a href="${this.appConfig.appUrl}">${this.appConfig.appName}</a></p>
            <p>© ${this.appConfig.year}. All rights reserved.</p>
          </footer>
        </div>
      </body>
      </html>
    `
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanitizeArgs(args: any[]) {
    return args.map(arg =>
      typeof arg === 'string'
        ? arg.replace(/[<>&"]/g, match => ({
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
        }[match] || ''))
        : arg,
    )
  }
}