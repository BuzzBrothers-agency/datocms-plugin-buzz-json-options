# DatoCMS Plugin Buzz JSON Options

This plugin allows you to define some properties that will be editable either one by one, or by (visual) presets. You can also define which properties are available for editing.

- [DatoCMS Plugin Buzz JSON Options](#datocms-plugin-buzz-json-options)
  - [Features](#features)
  - [Usage](#usage)
  - [Plugin level configuration](#plugin-level-configuration)
  - [Field level configuration](#field-level-configuration)
  - [Types](#types)

![DatoCMS Plugin Buzz JSON Options Preview](./docs/datocms-plugin-buzz-json-options-preview.webp)

## Features

1. Multiple input types:
   - `string`: Simple text input
   - `number`: Simple number input
   - `boolean`: Simple switch input
   - `select`: Select input
2. Support presets
   - Specify values you want
   - Display a preview
     - `image`
     - `video`: Play on hover
   - Preview size (aspect ratio and height)
3. Specify what is displayed
   - `props`: Choose with property field is displayed
   - `presets`: Display of not the presets previews
4. Plugin level configuration
5. Field level configuration
   - Can extends `templates` defined in the plugin config for convinience

## Usage

1. Specify the plugin level configuration
2. Create a `JSON` field on one of your blocks/models
3. Go to `Presentation`
4. Choose `Buzz JSON options`
5. Specify the field level configuration

## Plugin level configuration

Here's an example of plugin level configuration:

```json
{
  "settings": {
    "presets": {
      "display": true,
      "preview": {
        "aspectRatio": 1.77,
        "height": 200
      }
    },
    "props": {
      // can be an array of properties ids to display
      "display": true
    }
  },
  // specify some templates to extends fields from
  "templates": {
    "image": {
      "settings": {
        "preset": {
          "display": true
          // and other settings...
        }
      },
      "props": {
        "animated": {
          "type": "boolean",
          "label": "Animated",
          "default": true
        }
      }
    }
  }
}
```

## Field level configuration

Here's an example of a field level configuration

```json
{
  // extends from the "image" template
  "extends": "image",
  // some custom settings
  "settings": {
    "props": {
      "display": ["animated"]
    }
  },
  "presets": [
    {
      "label": "Animated image",
      "values": {
        "shape": "square",
        "animated": true
      },
      // can be images or videos
      "preview": "https://..."
    },
    {
      "label": "Non animated image",
      "values": {
        "shape": "circle",
        "animated": true
      },
      // can be images or videos
      "preview": "https://..."
    }
  ],
  "props": {
    "shape": {
      "type": "select",
      "label": "Shape",
      "options": [
        {
          "label": "Square",
          "value": "square"
        },
        {
          "label": "Circle",
          "value": "circle"
        }
      ]
    }
  }
}
```

## Types

Here's the typescript types for convinience

```ts
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
  presets?: {
    display?: boolean
    preview?: {
      aspectRatio: number
      height: number
    }
  }
  props: {
    display?: boolean | string[]
  }
}
```
