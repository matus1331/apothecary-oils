import { zodResolver } from '@hookform/resolvers/zod'
import { type ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  PRODUCT_TYPES,
  PRODUCT_TYPE_LABELS,
  oilInputSchema,
  type Manufacturer,
  type Oil,
  type OilInput,
  type ProductType,
} from '@/shared/schema'
import { Button } from './ui/Button'
import { SegmentedControl } from './ui/SegmentedControl'
import { Switch } from './ui/Switch'
import { TextInput } from './ui/TextInput'
import { Textarea } from './ui/Textarea'
import { ManufacturerCombobox } from './ManufacturerCombobox'

const formSchema = z.object({
  productType: z.enum(PRODUCT_TYPES, { message: 'Vyberte typ produktu' }),
  name: z.string().trim().min(1, 'Zadejte název').max(120, 'Maximálně 120 znaků'),
  latinName: z.string().max(120, 'Maximálně 120 znaků'),
  manufacturerName: z.string().max(120, 'Maximálně 120 znaků'),
  expiryDate: z
    .string()
    .refine(
      (v) => v === '' || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v))),
      'Neplatné datum',
    ),
  lowStock: z.boolean(),
  note: z.string().max(2000, 'Maximálně 2000 znaků'),
})
type FormValues = z.infer<typeof formSchema>

const options = PRODUCT_TYPES.map((v) => ({ value: v, label: PRODUCT_TYPE_LABELS[v] }))

function toDefaults(oil?: Oil): FormValues {
  return {
    productType: (oil?.productType ?? '') as ProductType,
    name: oil?.name ?? '',
    latinName: oil?.latinName ?? '',
    manufacturerName: oil?.manufacturerName ?? '',
    expiryDate: oil?.expiryDate ?? '',
    lowStock: oil?.lowStock ?? false,
    note: oil?.note ?? '',
  }
}

function addYears(n: number): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() + n)
  const p = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

type Props = {
  defaultOil?: Oil
  manufacturers: Manufacturer[]
  submitting?: boolean
  onSubmit: (input: OilInput) => void
  onDelete?: () => void
  onCancel: () => void
}

export function OilForm({ defaultOil, manufacturers, submitting, onSubmit, onDelete, onCancel }: Props) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toDefaults(defaultOil),
  })

  const isEdit = !!defaultOil

  const submit = handleSubmit((values) => {
    onSubmit(oilInputSchema.parse(values))
  })

  const err = (k: keyof FormValues) => errors[k]?.message

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Field label="Typ produktu" error={err('productType')}>
        <Controller
          control={control}
          name="productType"
          render={({ field }) => (
            <SegmentedControl
              name="Typ produktu"
              options={options}
              value={field.value || null}
              onChange={field.onChange}
              invalid={!!err('productType')}
            />
          )}
        />
      </Field>

      <Field label="Název" error={err('name')} htmlFor="oil-name">
        <TextInput id="oil-name" aria-label="Název" invalid={!!err('name')} {...register('name')} />
      </Field>

      <Field label="Latinský název" error={err('latinName')} htmlFor="oil-latin">
        <TextInput
          id="oil-latin"
          aria-label="Latinský název"
          className="italic"
          placeholder="Lavandula angustifolia"
          invalid={!!err('latinName')}
          {...register('latinName')}
        />
      </Field>

      <Field label="Výrobce" error={err('manufacturerName')}>
        <Controller
          control={control}
          name="manufacturerName"
          render={({ field }) => (
            <ManufacturerCombobox
              value={field.value}
              onChange={field.onChange}
              options={manufacturers}
              invalid={!!err('manufacturerName')}
            />
          )}
        />
      </Field>

      <Field label="Datum expirace" error={err('expiryDate')} htmlFor="oil-expiry">
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="oil-expiry"
            type="date"
            aria-label="Datum expirace"
            className="h-10 rounded-lg border border-line bg-surface px-3 text-sm text-ink focus:ring-2 focus:ring-accent/40"
            {...register('expiryDate')}
          />
          <Button type="button" variant="ghost" size="sm" onClick={() => setValue('expiryDate', addYears(1), { shouldValidate: true, shouldDirty: true })}>
            +1 rok
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setValue('expiryDate', addYears(2), { shouldValidate: true, shouldDirty: true })}>
            +2 roky
          </Button>
        </div>
      </Field>

      <Field label="Dochází" error={undefined}>
        <Controller
          control={control}
          name="lowStock"
          render={({ field }) => (
            <Switch checked={field.value} onChange={field.onChange} label="Dochází" />
          )}
        />
      </Field>

      <Field label="Poznámka" error={err('note')} htmlFor="oil-note">
        <Textarea id="oil-note" aria-label="Poznámka" invalid={!!err('note')} {...register('note')} />
      </Field>

      <div className="mt-1 flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={submitting || (isEdit && !isDirty)}>
          Uložit
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Zrušit
        </Button>
        {onDelete && (
          <Button type="button" variant="danger" className="ml-auto" onClick={onDelete}>
            Smazat
          </Button>
        )}
      </div>
    </form>
  )
}

function Field({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string
  error?: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-serif text-sm text-muted">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
