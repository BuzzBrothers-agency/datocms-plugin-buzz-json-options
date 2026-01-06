// @ts-nocheck
import { Canvas, FieldGroup, TextareaField } from 'datocms-react-ui'
import { useState } from 'react'
import './config.css'
import { type TConfig } from './config.type'

let updateTimeout

export default function Config({ ctx }) {
  const parameters = (ctx.plugin.attributes.parameters ?? {}) as TConfig
  const [textStyles, setTextStyles] = useState(parameters.textStyles ?? [])
  const [fieldsInWhichAllowCustomStyles, setFieldsInWhichAllowCustomStyles] =
    useState(parameters.fieldsInWhichAllowCustomStyles ?? [])

  function updateParameters(newParameters: Partial<TConfig>): void {
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
          <h2 className="typo-h3">Text styles</h2>
          <p className="typo-p">
            Text styles are available in the{' '}
            <a
              className="typo-a"
              href="https://www.datocms.com/docs/plugin-sdk/structured-text-customizations"
              target="_blank"
            >
              structured text
            </a>{' '}
            dato field. You can specify additional styles here following the
            JSON structure defined in the dato documentation.
          </p>
          <TextareaField
            name="textStyles"
            id="textStyles"
            hint="Define the text styles you want to be available in the editor."
            value={JSON.stringify(textStyles, null, 2)}
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

              setTextStyles(newValue)
              updateParameters({
                textStyles: newValue
              })
            }}
          />
          {/* <p>
            Specify in which field you want them to appear by adding api_key
            field value
          </p>
          <TextareaField
            name="fieldsInWhichAllowCustomStyles"
            id="fieldsInWhichAllowCustomStyles"
            hint="Define in which field you want the custom styles appears."
            value={JSON.stringify(fieldsInWhichAllowCustomStyles, null, 2)}
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

              setFieldsInWhichAllowCustomStyles(newValue)
              updateParameters({
                fieldsInWhichAllowCustomStyles: newValue
              })
            }}
          /> */}
        </FieldGroup>
      </div>
    </Canvas>
  )
}
