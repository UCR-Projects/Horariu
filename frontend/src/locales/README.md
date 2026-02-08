# Internationalization (i18n)

This directory contains all translation files for the application, organized by language and namespace.

## Structure

```
locales/
├── en/                     # English translations
│   ├── common.json        # Common translations (actions, time, theme, days, colors)
│   ├── courses.json       # Course-related translations
│   ├── schedules.json     # Schedule-related translations
│   ├── validation.json    # Validation messages
│   ├── errors.json        # Error messages
│   ├── info.json          # App info and about
│   └── index.ts           # Export all namespaces
├── es/                     # Spanish translations (same structure as en/)
│   ├── common.json
│   ├── courses.json
│   ├── schedules.json
│   ├── validation.json
│   ├── errors.json
│   ├── info.json
│   └── index.ts
├── types.ts               # TypeScript types for i18n
└── README.md              # This file
```

## Namespaces

### `common`
Common translations used across the entire app:
- **actions**: save, cancel, delete, edit, etc.
- **time**: from, to, hours
- **theme**: dark, light, system
- **days**: Monday, Tuesday, etc.
- **colors**: Color names
- **pagination**: Pagination messages

### `courses`
Course management translations:
- Course CRUD operations
- Group management
- Schedule configuration
- Confirmations and validations

### `schedules`
Schedule generation translations:
- Generate schedules
- Download schedules
- Success/error messages

### `validation`
Form validation messages:
- Course validation
- Group validation
- Schedule validation

### `errors`
Error messages:
- Error boundary messages
- 404 not found
- Generic errors

### `info`
App information:
- About page
- Contact information
- University info

## Usage

### Basic Usage (Default Namespace: `common`)

```typescript
import { useI18n } from '@/hooks/useI18n'

const MyComponent = () => {
  const { t } = useI18n()

  return (
    <button>{t('actions.save')}</button>
    // Output: "Guardar" (es) or "Save" (en)
  )
}
```

### Using Specific Namespace

```typescript
import { useI18n } from '@/hooks/useI18n'

const CourseForm = () => {
  const { t } = useI18n('courses')

  return (
    <h1>{t('addCourse')}</h1>
    // Output: "Agregar Curso" (es) or "Add Course" (en)
  )
}
```

### Using Multiple Namespaces

```typescript
import { useI18n } from '@/hooks/useI18n'

const MyComponent = () => {
  const { t } = useI18n(['common', 'courses'])

  return (
    <>
      <button>{t('common:actions.save')}</button>
      <h1>{t('courses:addCourse')}</h1>
    </>
  )
}
```

### Changing Language

```typescript
import { useLanguage } from '@/hooks/useI18n'

const LanguageSwitcher = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage()

  return (
    <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
      {availableLanguages.map((lng) => (
        <option key={lng} value={lng}>
          {lng.toUpperCase()}
        </option>
      ))}
    </select>
  )
}
```

### With Interpolation

```typescript
const { t } = useI18n('courses')

// Translation: "El curso \"{{itemName}}\" será eliminado"
t('confirmations.deleteCourse.description', { itemName: 'Matemáticas' })
// Output: "El curso \"Matemáticas\" será eliminado"
```

## Adding New Translations

### 1. Add to JSON files

Add the translation to both `es/` and `en/` files:

**es/common.json:**
```json
{
  "actions": {
    "save": "Guardar",
    "newAction": "Nueva Acción"  // ← Add here
  }
}
```

**en/common.json:**
```json
{
  "actions": {
    "save": "Save",
    "newAction": "New Action"  // ← Add here
  }
}
```

### 2. Use in component

```typescript
const { t } = useI18n()
t('actions.newAction')
```

TypeScript will autocomplete the key! 🎉

## Best Practices

1. **Use namespaces** to organize translations logically
2. **Keep keys in English** for consistency
3. **Use nested objects** for better organization
4. **Add comments** for complex translations
5. **Test both languages** before committing
6. **Use interpolation** for dynamic content
7. **Keep translations short** and concise

## Migration from Old Structure

Old structure (single file):
```json
{
  "save": "Guardar",
  "cancel": "Cancelar"
}
```

New structure (namespaced):
```json
{
  "actions": {
    "save": "Guardar",
    "cancel": "Cancelar"
  }
}
```

Usage change:
```typescript
// Old
t('save')

// New
t('actions.save')  // or t('common:actions.save')
```

## TypeScript Support

The `types.ts` file provides full TypeScript support:
- Autocomplete for translation keys
- Type checking for namespaces
- IntelliSense for nested keys

This is automatically configured via module augmentation.

