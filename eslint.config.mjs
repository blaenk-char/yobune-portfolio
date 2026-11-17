// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/singleline-html-element-content-newline': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': 'off',
    'vue/operator-linebreak': 'off',
    '@stylistic/quotes': 'off',
    '@stylistic/arrow-parens': 'off',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/member-delimiter-style': 'off'
  }
})
