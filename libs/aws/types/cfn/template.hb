// almost verbatim from https://github.com/sjmeverett/cfn-types

{{#each propertyTypes}}
/**
 * The `{{type}}` property type.
 * @see {{documentation}}
 */
export type {{name}} = {
  {{#each properties}}
  /**
    * @see {{documentation}}
    */
  {{name}}{{#if optional}}?{{/if}}: {{type}};
  {{/each}}
}

{{/each}}

{{#each attributeTypes}}
/**
 * Attributes for the `{{type}}` resource type.
 */
export type {{name}}Attributes = {
  {{#each properties}}
  "{{name}}"{{#if optional}}?{{/if}}: {{type}};
  {{/each}}
}
{{/each}}

{{#each resourceTypes}}
/**
 * Properties for the `{{type}}` resource type.
 * @see {{documentation}}
 */
export type {{name}}Properties = {
  {{#each properties}}
  /**
    * @see {{documentation}}
    */
  {{name}}{{#if optional}}?{{/if}}: {{type}};
  {{/each}}
}

{{/each}}
