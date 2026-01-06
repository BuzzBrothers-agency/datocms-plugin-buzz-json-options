// @ts-nocheck

import type { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import { connect, IntentCtx } from 'datocms-plugin-sdk'
import 'datocms-react-ui/styles.css'
import Config from './components/config/config.js'
import './css/index.css'
import { render } from './utils/render.js'

connect({
  customBlockStylesForStructuredTextField(field: Field, ctx: FieldIntentCtx) {
    // const { fieldsInWhichAllowCustomStyles } = ctx.plugin.attributes.parameters

    // if (!fieldsInWhichAllowCustomStyles.includes(field.attributes.api_key)) {
    //   console.log(
    //     '⚠️ No custom styles allowed for this field',
    //     field.attributes.api_key
    //   )
    //   return []
    // }

    return ctx.plugin.attributes?.parameters?.textStyles ?? []
  },
  manualFieldExtensions(ctx: IntentCtx) {
    // return [
    //   {
    //     id: 'buzz-link',
    //     name: 'Buzz link',
    //     type: 'editor',
    //     fieldTypes: ['json'],
    //     configurable: false
    //   }
    // ]
  },
  renderFieldAddon: (
    fieldExtensionId: string,
    ctx: RenderFieldExtensionCtx
  ) => {
    // switch (fieldExtensionId) {
    //   case 'presets':
    //     return render(<PresetsField ctx={ctx} />)
    // }
  },
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    // switch (fieldExtensionId) {
    //   case 'buzz-link':
    //     return render(<LinkField ctx={ctx} />)
    // }
  },
  // renderManualFieldExtensionConfigScreen(
  //   fieldExtensionId: string,
  //   ctx: RenderManualFieldExtensionConfigScreenCtx
  // ) {
  //   switch (fieldExtensionId) {
  //     case 'link':
  //       return render(<LinkConfigScreen ctx={ctx} />)
  //   }
  // },
  renderConfigScreen(ctx) {
    return render(<Config ctx={ctx} />)
  }
})
