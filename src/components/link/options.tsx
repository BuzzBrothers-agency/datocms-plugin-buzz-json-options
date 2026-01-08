// @ts-nocheck

import { commonVideoFileExtensions } from '@blackbyte/sugar/extension'
import { sleep } from '@blackbyte/sugar/function'
import { mergeDeep } from '@blackbyte/sugar/object'
import { parse } from '@blackbyte/sugar/string'
import {
  Canvas,
  FieldGroup,
  SelectField,
  SwitchField,
  TextField
} from 'datocms-react-ui'
import get from 'lodash/get'
import { useRef, useState } from 'react'
import {
  TDatoPluginBuzzOptions,
  TDatoPluginBuzzOptionsConfig,
  TDatoPluginBuzzOptionsPreset
} from '../../options.type'
import Collapsible from '../ui/collapsible/collapsible'
import './options.css'

export default function OptionsField({ ctx }) {
  const currentValueRaw = get(ctx.formValues, ctx.fieldPath) ?? '{}',
    currentOptions = JSON.parse(currentValueRaw) as TDatoPluginBuzzOptions

  // global plugin config
  const pluginConfig = (ctx.plugin.attributes.parameters?.options ??
    {}) as TDatoPluginBuzzOptionsConfig

  // field config
  const fieldConfig = ctx.parameters.options as TDatoPluginBuzzOptions

  // check if field config extends another config
  let baseConfig = {}
  if (fieldConfig?.extends) {
    baseConfig = pluginConfig.templates?.[fieldConfig.extends] || {}
    if (!baseConfig) {
      throw new Error(
        `[@buzzbrothers/datocms-plugin-buzz-options] The base config "${fieldConfig.extends}" does not exist in the plugin templates.`
      )
    }
  }

  const finalFieldConfig = mergeDeep([
    {
      settings: pluginConfig.settings ?? {}
    },
    baseConfig,
    fieldConfig
  ]) as TDatoPluginBuzzOptions

  // track mounted state
  const isMounted = useRef(false)

  // option state that store current selected options values
  const [options, setOptions] = useState(currentOptions)
  const [debugDisplayProps, setDebugDisplayProps] = useState(false)

  // function to set all options values at once
  const setOptionsValues = (newOptions: TDatoPluginBuzzOptions) => {
    // prevent update if values are the same
    if (JSON.stringify(options) === JSON.stringify(newOptions)) {
      return
    }

    // update state and form value
    setOptions({ ...newOptions })
    ctx.setFieldValue(ctx.fieldPath, JSON.stringify(newOptions))
  }

  // make active preset scroll into presets view
  const scrollPresetIntoView = async () => {
    await sleep(100)
    const $presets = document.querySelector('.options-field_presets')
    const $activePreset = document.querySelector(
      '.options-field_preset.-active'
    ) as HTMLElement
    if ($presets && $activePreset) {
      // scroll x to active preset
      $presets.scrollTo({
        left:
          $activePreset.offsetLeft -
          $presets.clientWidth / 2 +
          $activePreset.clientWidth / 2,
        behavior: 'smooth'
      })
    }
  }

  // get the select option object from a value
  const getSelectOptionFromValue = (prop: any, value: any) => {
    if (!prop.options) return null
    return prop.options.find((opt) => opt.value === value) || null
  }

  // compare two objects sorted alphabetically
  const isSameObject = (obj1: any, obj2: any) => {
    const newObject1 = { ...obj1 }
    const newObject2 = { ...obj2 }

    const excludedProps = finalFieldConfig.settings?.presets?.excludeProps || []
    excludedProps.forEach((propId: string) => {
      delete newObject1[propId]
    })

    // remove properties in the second object that are not in the first object
    for (const key in newObject2) {
      if (!(key in newObject1)) {
        delete newObject2[key]
      }
    }

    const serialitedObject1 = serializeValues(newObject1)
    const serialitedObject2 = serializeValues(newObject2)
    return serializeValues(newObject1) == serializeValues(newObject2)
  }

  // serialize object keys alphabetically
  const serializeValues = (object: any) => {
    // sort object keys alphybetically and return JSON string
    const sortedObject: any = {}
    Object.keys(object)
      .sort()
      .forEach((key) => {
        sortedObject[key] = object[key]
      })
    return JSON.stringify(sortedObject)
  }

  // set default values for options that are not set yet
  const setDefaults = () => {
    const newOptions = { ...options }
    if (finalFieldConfig.props) {
      Object.entries(finalFieldConfig.props).forEach(([propId, prop]) => {
        if (newOptions[propId] === undefined && prop.default !== undefined) {
          newOptions[propId] = prop.default
        }
      })
    }
    setOptionsValues(newOptions)
  }

  // on mount, set defaults if needed
  if (!isMounted.current) {
    // mark as mounted
    isMounted.current = true

    // set the default if needed
    setDefaults()

    // scroll to active preset
    scrollPresetIntoView()

    // add keybinding to toggle props display (debug feature)
    if (finalFieldConfig.settings?.debug?.togglePropsKey) {
      window.addEventListener('keydown', (e) => {
        if (e.metaKey && e.shiftKey && e.key === 'p') {
          e.preventDefault()
          e.stopPropagation()
          setDebugDisplayProps((prev) => !prev)
        }
      })
    }
  }

  // function to set a single option value
  const setOptionValue = (optionId: string, newValue: any) => {
    // prevent update if value is the same
    if (options[optionId] === newValue) {
      return
    }

    // create new options object
    const newOptions = { ...options, [optionId]: newValue }

    // update state and form value
    setOptionsValues(newOptions)
  }

  // function to display a preset
  const displayPreset = (
    presetId: string,
    preset: TDatoPluginBuzzOptionsPreset
  ) => {
    const fileExtension = preset.preview?.split('.').pop()
    const isVideo =
      fileExtension && commonVideoFileExtensions().includes(fileExtension)
    const isHtml = fileExtension === 'html' || fileExtension === 'htm'

    return (
      <div
        className={`options-field_preset -${isSameObject(preset.values, options) ? 'active' : 'inactive'}`}
        style={{
          '--options-preset-preview-aspect-ratio':
            finalFieldConfig.settings?.presets?.preview?.aspectRatio || 1,
          '--options-preset-preview-height':
            finalFieldConfig.settings?.presets?.preview?.height ?? 200
        }}
        key={presetId}
        onClick={(e: MouseEvent) => {
          setOptionsValues({ ...options, ...preset.values })
          scrollPresetIntoView()
        }}
      >
        {preset.preview && (
          <div className={`options-field_preset-preview`}>
            {isVideo ? (
              <video
                src={preset.preview}
                alt="preset preview"
                playsInline
                muted
                loop
                onPointerEnter={(e: PointerEvent) => {
                  e.target.play?.()
                }}
                onPointerLeave={(e: PointerEvent) => {
                  e.target.pause()
                  e.target.currentTime = 0
                }}
              />
            ) : isHtml ? (
              <iframe
                src={preset.preview}
                title="preset preview"
                scrolling="no"
              />
            ) : (
              <img src={preset.preview} alt="preset preview" />
            )}
          </div>
        )}
        <div className="options-field_preset-label">{preset.label}</div>
      </div>
    )
  }

  console.log('F', finalFieldConfig)

  return (
    <Canvas ctx={ctx}>
      <Collapsible
        label={finalFieldConfig.settings?.panel?.label || 'Options'}
        icon={finalFieldConfig.settings?.panel?.icon}
        className="options-field_collapsible"
        collapsed={finalFieldConfig.settings?.panel?.collapsed}
      >
        <div className="options-field">
          {finalFieldConfig.presets &&
            finalFieldConfig.settings?.presets?.display !== false && (
              <div className="options-field_presets">
                {Object.entries(finalFieldConfig.presets).map(
                  ([presetId, preset]) => displayPreset(presetId, preset)
                )}
              </div>
            )}
          <div
            className={`options-field_props ${finalFieldConfig.settings?.props?.display === false && !debugDisplayProps ? '-hidden' : ''}`}
          >
            {finalFieldConfig.props &&
              Object.entries(finalFieldConfig.props)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([propId, prop]) => {
                  // check if prop should be displayed
                  if (
                    !debugDisplayProps &&
                    finalFieldConfig.settings?.props?.display &&
                    Array.isArray(finalFieldConfig.settings.props.display) &&
                    !finalFieldConfig.settings.props.display.includes(propId)
                  ) {
                    return null
                  }

                  switch (true) {
                    case 'select':
                    case prop.options?.length > 0:
                      return (
                        <FieldGroup
                          className={`options-field_prop -select -${prop.type}`}
                          key={propId}
                          label={propId}
                        >
                          <SelectField
                            id={propId}
                            name={propId}
                            label={prop.label}
                            // hint={prop.hint}
                            value={getSelectOptionFromValue(
                              prop,
                              options[propId]
                            )}
                            selectInputProps={{
                              options: prop.options.map((opt) => ({
                                label: opt.label,
                                value: opt.value
                              }))
                            }}
                            onChange={(newValue) => {
                              setOptionValue(propId, parse(newValue.value))
                            }}
                          />
                        </FieldGroup>
                      )
                    case prop.type === 'string':
                    case prop.type === 'number':
                      return (
                        <FieldGroup
                          className={`options-field_prop -${prop.type}`}
                          key={propId}
                          label={propId}
                        >
                          <TextField
                            id={propId}
                            name={propId}
                            // hint={prop.hint}
                            type={prop.type === 'number' ? 'number' : 'text'}
                            label={prop.label}
                            value={options[propId] || prop.default || ''}
                            textInputProps={{
                              onBlur: (e) => {}
                            }}
                            onChange={(newValue) => {
                              setOptionValue(propId, parse(newValue))
                            }}
                          />
                        </FieldGroup>
                      )
                    case prop.type === 'boolean':
                      return (
                        <FieldGroup
                          className={`options-field_prop -${prop.type}`}
                          key={propId}
                          label={propId}
                        >
                          <SwitchField
                            id={propId}
                            name={propId}
                            label={prop.label}
                            // hint={prop.hint}
                            value={options[propId] ?? prop.default}
                            onChange={(newValue) => {
                              setOptionValue(propId, newValue)
                            }}
                          />
                        </FieldGroup>
                      )
                    default:
                      return null
                  }
                })}
          </div>
        </div>
      </Collapsible>
    </Canvas>
  )
}
