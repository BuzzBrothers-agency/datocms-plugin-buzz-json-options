// @ts-nocheck

import type { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import { connect, IntentCtx } from 'datocms-plugin-sdk'
import 'datocms-react-ui/styles.css'
import Config from './components/config/config.js'
import OptionsField from './components/link/options.js'
import OptionsConfigScreen from './components/link/optionsConfigScreen.js'
import './css/index.css'
import { render } from './utils/render.js'

connect({
  customBlockStylesForStructuredTextField(field: Field, ctx: FieldIntentCtx) {
    return ctx.plugin.attributes?.parameters?.options ?? []
  },
  manualFieldExtensions(ctx: IntentCtx) {
    return [
      {
        id: 'buzz-json-options',
        name: 'Buzz JSON options',
        type: 'editor',
        fieldTypes: ['json'],
        configurable: true
      }
    ]
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
    switch (fieldExtensionId) {
      case 'buzz-json-options':
        return render(<OptionsField ctx={ctx} />)
    }
  },
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx
  ) {
    switch (fieldExtensionId) {
      case 'buzz-json-options':
        return render(<OptionsConfigScreen ctx={ctx} />)
    }
  },
  renderConfigScreen(ctx) {
    return render(<Config ctx={ctx} />)
  }
})
