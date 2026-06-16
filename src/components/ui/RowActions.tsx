type RowActionsProps = {
  disabled: boolean
  editLabel: string
  disableLabel: string
  enableLabel: string
  onEdit: () => void
  onDisable: () => void
  onEnable: () => void
}

export function RowActions({
  disabled,
  editLabel,
  disableLabel,
  enableLabel,
  onEdit,
  onDisable,
  onEnable,
}: RowActionsProps) {
  return (
    <div className="row-actions">
      <button type="button" className="action-btn action-btn--edit" onClick={onEdit} title={editLabel}>
        ✏️
        <span className="action-btn__text">{editLabel}</span>
      </button>
      {disabled ? (
        <button type="button" className="action-btn action-btn--enable" onClick={onEnable} title={enableLabel}>
          ↩️
          <span className="action-btn__text">{enableLabel}</span>
        </button>
      ) : (
        <button type="button" className="action-btn action-btn--disable" onClick={onDisable} title={disableLabel}>
          🚫
          <span className="action-btn__text">{disableLabel}</span>
        </button>
      )}
    </div>
  )
}
