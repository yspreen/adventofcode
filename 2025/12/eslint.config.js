// @ts-nocheck
import nextConfig from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";
import drizzle from "eslint-plugin-drizzle";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

// Custom auto-fix entities rule
const autoFixEntities = {
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description: "Auto-fix unescaped entities in JSX text",
      category: "Best Practices",
    },
  },
  create(context) {
    const DEFAULTS = [">", '"', "'", "}"];
    const ENTITY_MAP = {
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
      "}": "&#125;",
    };

    const forbid = DEFAULTS;
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      JSXText(node) {
        if (
          node.parent.type !== "JSXAttribute" &&
          node.parent.type !== "JSXExpressionContainer"
        ) {
          const text = sourceCode.getText(node);
          const foundChars = [];

          forbid.forEach((char) => {
            const escaped = ENTITY_MAP[char];
            if (text.includes(char) && !text.includes(escaped)) {
              foundChars.push(char);
            }
          });

          if (foundChars.length > 0) {
            context.report({
              node,
              message: `Unescaped ${foundChars.map((c) => `\`${c}\``).join(", ")} can be escaped.`,
              fix(fixer) {
                let replacement = text;
                forbid.forEach((char) => {
                  replacement = replacement.split(char).join(ENTITY_MAP[char]);
                });
                return fixer.replaceText(node, replacement);
              },
            });
          }
        }
      },
    };
  },
};

// Escape special regex characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Custom Tailwind canonical classes rule
const tailwindCanonical = {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      description: "Enforce canonical Tailwind CSS class names",
      category: "Best Practices",
    },
  },
  create(context) {
    const CANONICAL_MAP = {
      "bg-gradient-to-t": "bg-linear-to-t",
      "bg-gradient-to-tr": "bg-linear-to-tr",
      "bg-gradient-to-r": "bg-linear-to-r",
      "bg-gradient-to-br": "bg-linear-to-br",
      "bg-gradient-to-b": "bg-linear-to-b",
      "bg-gradient-to-bl": "bg-linear-to-bl",
      "bg-gradient-to-l": "bg-linear-to-l",
      "bg-gradient-to-tl": "bg-linear-to-tl",
      "flex-shrink-0": "shrink-0",
      "h-[8px]": "h-2",
    };

    function checkClassNames(node, value) {
      if (!value) return;

      const classes = value.split(/\s+/);
      const fixes = [];

      classes.forEach((className) => {
        if (CANONICAL_MAP[className]) {
          fixes.push({
            oldClass: className,
            newClass: CANONICAL_MAP[className],
            type: "mapping",
          });
        }

        // Check for unnecessary underscores in arbitrary values (e.g., bg-[...])
        if (className.includes("[") && className.includes("_")) {
          // Remove underscores after commas and parentheses in arbitrary values
          const canonical = className.replace(/([,\(])_/g, "$1");
          if (canonical !== className) {
            fixes.push({
              oldClass: className,
              newClass: canonical,
              type: "underscore",
            });
          }
        }
      });

      if (fixes.length > 0) {
        context.report({
          node,
          message: `Non-canonical Tailwind classes found: ${fixes.map((f) => f.oldClass).join(", ")}`,
          fix(fixer) {
            let newValue = value;
            fixes.forEach(({ oldClass, newClass, type }) => {
              if (type === "mapping") {
                newValue = newValue.replace(
                  new RegExp(`(?<=^|\\s)${escapeRegExp(oldClass)}(?=\\s|$)`, "g"),
                  newClass,
                );
              } else if (type === "underscore") {
                // For arbitrary values, do a simple replacement
                newValue = newValue.replace(oldClass, newClass);
              }
            });

            if (node.type === "JSXAttribute") {
              return fixer.replaceText(node.value, `"${newValue}"`);
            }
            return fixer.replaceText(node, `"${newValue}"`);
          },
        });
      }
    }

    return {
      JSXAttribute(node) {
        if (
          node.name &&
          node.name.name === "className" &&
          node.value &&
          node.value.type === "Literal"
        ) {
          checkClassNames(node, node.value.value);
        }
      },

      Property(node) {
        if (
          node.key &&
          node.key.name === "className" &&
          node.value &&
          node.value.type === "Literal"
        ) {
          checkClassNames(node, node.value.value);
        }
      },
    };
  },
};

export default tseslint.config(
  {
    ignores: [".next"],
  },
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      drizzle,
      custom: {
        rules: {
          "auto-fix-entities": autoFixEntities,
          "tailwind-canonical": tailwindCanonical,
        },
      },
    },
    extends: [
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db", "ctx.db"] },
      ],
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "custom/auto-fix-entities": "error",
      "custom/tailwind-canonical": "error",
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  eslintPluginPrettier,
);
