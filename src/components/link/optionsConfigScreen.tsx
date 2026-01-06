// @ts-nocheck

import { Canvas, TextareaField } from 'datocms-react-ui'
import { useCallback, useState } from 'react'
import { TLinkParameter } from './link.type.js'

export default function OptionsConfigScreen({ ctx }) {
  const [formValues, setFormValues] = useState<Partial<TLinkParameter>>(
    ctx.parameters
  )
  const update = useCallback(
    (field, value) => {
      const newParameters = { ...formValues, [field]: JSON.parse(value) }
      setFormValues(newParameters)
      ctx.setParameters(newParameters)
    },
    [formValues, setFormValues, ctx.setParameters]
  )

  return (
    <Canvas ctx={ctx}>
      <p className="typo-p">
        Define some options that you will then be able to extend in each of your
        JSON fields .<br />
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
        id="options"
        name="options"
        label="Options"
        required
        textareaInputProps={{ style: { height: '500px' } }}
        value={JSON.stringify(formValues.options, null, 2)}
        onChange={update.bind(null, 'options')}
      />
    </Canvas>
  )
}
