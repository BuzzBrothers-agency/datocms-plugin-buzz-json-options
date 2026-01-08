export type TDatoPluginBuzzOptions = {
  settings?: TDatoPluginBuzzOptionsSettings
  presets?: Record<string, TDatoPluginBuzzOptionsPreset>
  props?: Record<string, TDatoPluginBuzzOptionsProp>
  extends?: string
}

export type TDatoPluginBuzzOptionsConfig = {
  settings?: TDatoPluginBuzzOptionsSettings
  templates?: {
    [key: string]: TDatoPluginBuzzOptions
  }
}

export type TDatoPluginBuzzOptionsPreset = {
  label: string
  values: {
    [key: string]: string | number | boolean
  }
  preview?: string
}

export type TDatoPluginBuzzOptionsProp =
  | {
      label: string
      type: 'string' | 'number' | 'boolean'
      default?: string | number | boolean
    }
  | {
      type: 'string' | 'number' | 'select'
      options: {
        label: string
        value: string | number
      }
    }

export type TDatoPluginBuzzOptionsSettings = {
  debug?: {
    togglePropsKey?: boolean
  }
  presets?: {
    display?: boolean
    excludeProps?: string[]
    preview?: {
      aspectRatio: number
      height: number
    }
  }
  props: {
    display?: boolean | string[]
  }
}
