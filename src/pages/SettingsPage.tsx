import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { GlossButton } from '../components/ui/GlossButton'
import { SettingsCard } from '../components/settings/SettingsCard'
import { SettingsDangerZone } from '../components/settings/SettingsDangerZone'
import { SettingsFormRow } from '../components/settings/SettingsFormRow'
import { SettingsSaveBar } from '../components/settings/SettingsSaveBar'
import { SettingsSearch } from '../components/settings/SettingsSearch'
import { SettingsSectionHeader } from '../components/settings/SettingsSectionHeader'
import { SettingsShell } from '../components/settings/SettingsShell'
import { SettingsSidebar } from '../components/settings/SettingsSidebar'
import { SettingsTable } from '../components/settings/SettingsTable'
import { useApp } from '../context/AppProvider'
import {
  getDefaultSettingsValues,
  SETTINGS_SECTIONS,
  settingsText,
  type SettingsField,
  type SettingsPanel,
  type SettingsSection,
  type SettingsSectionId,
} from '../data/settingsWorkspace'
import { wrapA4Document } from '../export-templates/shared/a4Document'
import { openExportWindow } from '../export-templates/shared/openExportWindow'

export function SettingsPage() {
  const { locale, t } = useApp()
  const [activeId, setActiveId] = useState<SettingsSectionId>('company')
  const [search, setSearch] = useState('')
  const [savedValues, setSavedValues] = useState(getDefaultSettingsValues)
  const [values, setValues] = useState(getDefaultSettingsValues)
  const [notice, setNotice] = useState<string>()

  const filteredSections = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return SETTINGS_SECTIONS
    return SETTINGS_SECTIONS.filter((section) => {
      const haystack = [
        settingsText(section.title, locale),
        settingsText(section.description, locale),
        section.permission,
        section.route,
      ].join(' ').toLowerCase()
      return haystack.includes(term)
    })
  }, [locale, search])

  const activeSection = SETTINGS_SECTIONS.find((section) => section.id === activeId) ?? SETTINGS_SECTIONS[0]
  const errors = validateSection(activeSection, values, locale)
  const dirty = JSON.stringify(values) !== JSON.stringify(savedValues)

  const handleSave = () => {
    const currentErrors = validateSection(activeSection, values, locale)
    if (Object.keys(currentErrors).length) {
      setNotice(locale === 'ar' ? 'يرجى إكمال الحقول المطلوبة قبل الحفظ.' : 'Please complete required fields before saving.')
      return
    }
    setSavedValues(values)
    setNotice(locale === 'ar' ? 'تم حفظ إعدادات الواجهة محلياً. الربط الخلفي جاهز كمرحلة لاحقة.' : 'Settings saved locally. Backend integration point is ready.')
  }

  const handleReset = () => {
    setValues(savedValues)
    setNotice(locale === 'ar' ? 'تمت إعادة التغييرات إلى آخر نسخة محفوظة.' : 'Changes restored to last saved state.')
  }

  const handleValueChange = (key: string, value: string | boolean) => {
    setNotice(undefined)
    setValues((current) => ({ ...current, [key]: value }))
  }

  const handleSectionSelect = (id: SettingsSectionId) => {
    setActiveId(id)
    setNotice(undefined)
  }

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify({ section: activeSection.id, values }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${activeSection.id}-settings.json`
    link.click()
    URL.revokeObjectURL(url)
    setNotice(locale === 'ar' ? 'تم تصدير إعدادات القسم إلى JSON.' : 'Section settings exported to JSON.')
  }

  const previewTemplate = () => {
    const title = locale === 'ar' ? 'معاينة قالب إعدادات النظام' : 'Settings template preview'
    const html = wrapA4Document({
      title,
      locale,
      mode: 'preview',
      previewBanner: locale === 'ar' ? 'معاينة قالب إعدادات' : 'Settings template preview',
      printLabel: locale === 'ar' ? 'طباعة' : 'Print',
      closeLabel: locale === 'ar' ? 'إغلاق' : 'Close',
      bodyHtml: `
        <section class="doc-header">
          <div>
            <p class="doc-header__eyebrow">ALamal-AB ERP</p>
            <h1>${title}</h1>
            <p>${settingsText(activeSection.description, locale)}</p>
          </div>
        </section>
        <div class="doc-section">
          <h2>${settingsText(activeSection.title, locale)}</h2>
          <p>${locale === 'ar' ? 'هذه المعاينة تستخدم قالب A4 المشترك في المشروع.' : 'This preview uses the shared A4 project template.'}</p>
        </div>
      `,
    })
    openExportWindow(html, title)
    setNotice(locale === 'ar' ? 'تم فتح معاينة الطباعة باستخدام القالب المشترك.' : 'Print preview opened using the shared template.')
  }

  return (
    <>
      <PageHeader
        title={t('settings.title')}
        subtitle={locale === 'ar' ? 'مركز تحكم ERP لإعداد الشركة والصلاحيات والمالية والطباعة والتشغيل.' : 'ERP control center for company, permissions, finance, output, and operations.'}
        actions={
          <div className="settings-page-actions">
            <GlossButton variant="ghost" onClick={previewTemplate}>{locale === 'ar' ? 'معاينة قالب PDF' : 'PDF preview'}</GlossButton>
            <GlossButton variant="accent" disabled={!dirty} onClick={handleSave}>{locale === 'ar' ? 'حفظ التغييرات' : 'Save changes'}</GlossButton>
          </div>
        }
      />

      <SettingsSearch
        value={search}
        placeholder={locale === 'ar' ? 'بحث في الإعدادات' : 'Search settings'}
        onChange={setSearch}
      />

      <SettingsShell
        sidebar={
          <SettingsSidebar
            sections={filteredSections.length ? filteredSections : SETTINGS_SECTIONS}
            activeId={activeSection.id}
            locale={locale}
            onSelect={handleSectionSelect}
          />
        }
      >
        <SettingsSectionHeader
          section={activeSection}
          locale={locale}
          dirty={dirty}
          onSave={handleSave}
          onReset={handleReset}
          onExport={exportSettings}
        />

        {notice && <div className="settings-notice">{notice}</div>}

        <div className="settings-panels">
          {activeSection.panels.map((panel) => (
            <SettingsPanelRenderer
              key={panel.id}
              section={activeSection}
              panel={panel}
              locale={locale}
              values={values}
              errors={errors}
              onChange={handleValueChange}
              onAction={(message) => setNotice(message)}
              onPreview={previewTemplate}
            />
          ))}
        </div>
      </SettingsShell>

      <SettingsSaveBar dirty={dirty} message={notice} locale={locale} onSave={handleSave} onReset={handleReset} />
    </>
  )
}

type SettingsPanelRendererProps = {
  section: SettingsSection
  panel: SettingsPanel
  locale: 'ar' | 'en'
  values: Record<string, string | boolean>
  errors: Record<string, string>
  onChange: (key: string, value: string | boolean) => void
  onAction: (message: string) => void
  onPreview: () => void
}

function SettingsPanelRenderer({
  section,
  panel,
  locale,
  values,
  errors,
  onChange,
  onAction,
  onPreview,
}: SettingsPanelRendererProps) {
  if (panel.type === 'fields') {
    return (
      <SettingsCard title={settingsText(panel.title, locale)} description={panel.description ? settingsText(panel.description, locale) : undefined}>
        <div className="settings-form-grid">
          {panel.fields.map((field) => (
            <SettingsFormRow
              key={field.id}
              sectionId={section.id}
              field={field}
              locale={locale}
              value={values[`${section.id}.${field.id}`] ?? field.value}
              error={errors[`${section.id}.${field.id}`]}
              onChange={onChange}
            />
          ))}
        </div>
      </SettingsCard>
    )
  }

  if (panel.type === 'table') {
    return (
      <SettingsCard title={settingsText(panel.title, locale)} description={panel.description ? settingsText(panel.description, locale) : undefined}>
        <SettingsTable
          columns={panel.columns}
          rows={panel.rows}
          locale={locale}
          actionLabel={panel.actionLabel}
          onAction={() => onAction(locale === 'ar' ? 'تم فتح واجهة الإضافة المحلية. الربط الخلفي لاحقاً.' : 'Local add UI hook is ready. Backend comes later.')}
        />
      </SettingsCard>
    )
  }

  if (panel.type === 'permissions') {
    return (
      <SettingsCard title={settingsText(panel.title, locale)} description={panel.description ? settingsText(panel.description, locale) : undefined}>
        <div className="table-wrap">
          <table className="data-table settings-permission-table">
            <thead>
              <tr>
                <th>{locale === 'ar' ? 'الوحدة' : 'Module'}</th>
                <th>{locale === 'ar' ? 'عرض' : 'View'}</th>
                <th>{locale === 'ar' ? 'إنشاء' : 'Create'}</th>
                <th>{locale === 'ar' ? 'اعتماد' : 'Approve'}</th>
                <th>{locale === 'ar' ? 'ترحيل/تنفيذ' : 'Post'}</th>
              </tr>
            </thead>
            <tbody>
              {panel.permissions.map((permission) => (
                <tr key={settingsText(permission.module, locale)}>
                  <td>{settingsText(permission.module, locale)}</td>
                  {(['view', 'create', 'approve', 'post'] as const).map((action) => (
                    <td key={action}>{permission.actions[action] ? '✓' : '—'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    )
  }

  if (panel.type === 'templates') {
    return (
      <SettingsCard
        title={settingsText(panel.title, locale)}
        description={panel.description ? settingsText(panel.description, locale) : undefined}
        action={<GlossButton variant="ghost" size="sm" onClick={onPreview}>{locale === 'ar' ? 'معاينة' : 'Preview'}</GlossButton>}
      >
        <div className="settings-template-list">
          {panel.templates.map((template) => (
            <div key={settingsText(template.name, locale)} className="settings-template-item">
              <div>
                <strong>{settingsText(template.name, locale)}</strong>
                <span>{settingsText(template.document, locale)} · {template.paper}</span>
              </div>
              <em>{template.default ? (locale === 'ar' ? 'افتراضي' : 'Default') : (locale === 'ar' ? 'اختياري' : 'Optional')}</em>
            </div>
          ))}
        </div>
      </SettingsCard>
    )
  }

  if (panel.type === 'audit') {
    return (
      <SettingsCard title={settingsText(panel.title, locale)} description={panel.description ? settingsText(panel.description, locale) : undefined}>
        <div className="settings-audit-list">
          {panel.events.map((event) => (
            <div key={`${event.user}-${event.at}`} className="settings-audit-item">
              <strong>{settingsText(event.action, locale)}</strong>
              <span>{event.user} · {settingsText(event.module, locale)} · {event.at}</span>
              <p>{settingsText(event.summary, locale)}</p>
            </div>
          ))}
        </div>
      </SettingsCard>
    )
  }

  return (
    <SettingsCard title={settingsText(panel.title, locale)}>
      <SettingsDangerZone
        title={settingsText(panel.title, locale)}
        description={settingsText(panel.description, locale)}
        actionLabel={settingsText(panel.actionLabel, locale)}
        disabledReason={panel.disabledReason ? settingsText(panel.disabledReason, locale) : undefined}
        onAction={() => onAction(locale === 'ar' ? 'تم تسجيل طلب الإجراء الحساس محلياً.' : 'Sensitive action request recorded locally.')}
      />
    </SettingsCard>
  )
}

function validateSection(section: SettingsSection, values: Record<string, string | boolean>, locale: 'ar' | 'en') {
  const errors: Record<string, string> = {}
  for (const panel of section.panels) {
    if (panel.type !== 'fields') continue
    for (const field of panel.fields) {
      validateField(section.id, field, values, locale, errors)
    }
  }
  return errors
}

function validateField(
  sectionId: string,
  field: SettingsField,
  values: Record<string, string | boolean>,
  locale: 'ar' | 'en',
  errors: Record<string, string>,
) {
  const key = `${sectionId}.${field.id}`
  const value = values[key]
  if (field.required && !String(value ?? '').trim()) {
    errors[key] = locale === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'
  }
  if (field.type === 'email' && value && !String(value).includes('@')) {
    errors[key] = locale === 'ar' ? 'صيغة البريد غير صحيحة' : 'Invalid email format'
  }
  if (field.type === 'url' && value && !String(value).startsWith('http')) {
    errors[key] = locale === 'ar' ? 'يجب أن يبدأ الرابط بـ http' : 'URL must start with http'
  }
}
