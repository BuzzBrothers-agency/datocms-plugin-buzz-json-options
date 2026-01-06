// @ts-nocheck
import { Canvas, FieldGroup, TextareaField } from 'datocms-react-ui'
import { useState } from 'react'
import { TDatoPluginBuzzOptionsConfig } from '../../options.type'
import './config.css'

let updateTimeout

export default function Config({ ctx }) {
  const parameters = (ctx.plugin.attributes.parameters ??
    {}) as TDatoPluginBuzzOptionsConfig
  const [options, setOptions] = useState(parameters.options ?? {})

  function updateParameters(
    newParameters: Partial<TDatoPluginBuzzOptionsConfig>
  ): void {
    clearTimeout(updateTimeout)
    updateTimeout = setTimeout(() => {
      ctx.updatePluginParameters({
        ...parameters,
        ...newParameters
      })
      ctx.notice('Config updated successfully!')
    }, 500)
  }

  return (
    <Canvas ctx={ctx}>
      <div className="config">
        <FieldGroup>
          <h2 className="typo-h3">Options</h2>
          <p className="typo-p">
            Define some options that you will then be able to extend in each of
            your JSON fields .<br />
            Check out the{' '}
            <a
              className="typo-a"
              href="https://github.com/BuzzBrothers-agency/datocms-plugin-buzz-options"
              target="_blank"
            >
              documentation
            </a>{' '}
            for more details.
          </p>
          <TextareaField
            name="options"
            id="options"
            hint="Define some options that will be available to extend in your JSON fields."
            value={JSON.stringify(options, null, 2)}
            textareaInputProps={{
              rows: 15,
              monospaced: true
            }}
            onChange={(newValue) => {
              try {
                newValue = JSON.parse(newValue)
              } catch (e) {
                ctx.alert('The JSON you provided is invalid')
                return
              }

              setOptions(newValue)
              updateParameters({
                options: newValue
              })
            }}
          />
        </FieldGroup>
      </div>
    </Canvas>
  )
}
